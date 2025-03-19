# THIS COMPONENT WILL:
# contain the command to send a text to speech message using windows tts.
# ----------------------
# TODO:
# -tts <String>
def get_dependencies():
    return """
import win32com.client
"""
def get_code():
    return """

    elif message.content.lower().startswith(".tts"):
        content = message.content[5:]
        speaker = win32com.client.Dispatch("SAPI.SpVoice")
        speaker.Speak(content)
        await message.channel.send("```diff\\n+ TTS\\n```")
        
"""
