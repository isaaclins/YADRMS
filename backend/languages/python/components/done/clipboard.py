# THIS COMPONENT WILL:
# contain the command to be able to get information from the clipboard and also add stuff to the clipboard in a single line
# ----------------------
# TODO:
# -clipboard
# -clipboard add <string>
def get_dependencies():
    return """
import pyperclip
"""

def get_code():
        return """

    # ADDED CLIPBOARD MODULE
    elif message.content.lower() == "clipboard":
        parts = message.content.split()
        option = parts[1] if len(parts) > 1 else None
        if option == "add":
            # Here is the code to add content to the clipboard
            content = message.content[15:]
            pyperclip.copy(content)
            await message.channel.send("```diff\\n+ Added to Clipboard\\n```")
        else:
            # Here is the code to get the content of the clipboard
            await message.channel.send("```diff\\n+ Clipboard\\n```")
            await message.channel.send("```diff\\n+ " + pyperclip.paste() + "\\n```")
            
"""
