# THIS COMPONENT WILL:
# contain the commands for lowering or increasing the volume in steps whilst also being able to set it to a specific value. (in %)
# ----------------------
# TODO:
# -lower <int>
# -increase <int>
# -set <int>
# ----------------------

def get_code():
    return 
'''
        # ADDED VOLUME MODULE
        import platform
        import subprocess

        # Global volume percentage (0-100)
        current_volume = 50

        def set_system_volume(volume):
            """Set the system volume based on the OS."""
            os_name = platform.system()
            if os_name == "Linux":
                # Uses amixer (ensure it is installed and "Master" is the correct control)
                subprocess.run(["amixer", "set", "Master", f"{volume}%"])
            elif os_name == "Darwin":
                # Uses AppleScript via osascript to set macOS output volume
                subprocess.run(["osascript", "-e", f"set volume output volume {volume}"])
            elif os_name == "Windows":
                try:
                    # Requires pycaw and comtypes (install via pip)
                    from ctypes import POINTER, cast
                    import comtypes
                    from comtypes import CLSCTX_ALL
                    from pycaw.pycaw import AudioUtilities, IAudioEndpointVolume

                    devices = AudioUtilities.GetSpeakers()
                    interface = devices.Activate(IAudioEndpointVolume._iid_, CLSCTX_ALL, None)
                    volume_interface = cast(interface, POINTER(IAudioEndpointVolume))
                    # SetMasterVolumeLevelScalar takes a float between 0.0 and 1.0
                    volume_interface.SetMasterVolumeLevelScalar(volume / 100.0, None)
                except ImportError:
                    print("pycaw module not installed. Cannot adjust volume on Windows.")
            else:
                print("Unsupported OS.")

        async def handle_volume_command(message):
            global current_volume

            if message.content.lower().startswith(".lower "):
                # Extract parameter after ".lower "
                param = message.content[7:].strip()
                try:
                    decrement = int(param)
                    if decrement < 0:
                        await message.channel.send("Volume cannot be negative")
                    else:
                        current_volume = max(0, current_volume - decrement)
                        set_system_volume(current_volume)
                        await message.channel.send(f"Volume lowered to {current_volume}%")
                except ValueError:
                    await message.channel.send("Please provide a valid number.")

            elif message.content.lower().startswith(".increase "):
                # Extract parameter after ".increase "
                param = message.content[10:].strip()
                try:
                    increment = int(param)
                    if increment < 0:
                        await message.channel.send("Volume cannot be negative")
                    else:
                        current_volume = min(100, current_volume + increment)
                        set_system_volume(current_volume)
                        await message.channel.send(f"Volume increased to {current_volume}%")
                except ValueError:
                    await message.channel.send("Please provide a valid number.")

            elif message.content.lower().startswith(".set "):
                # Extract parameter after ".set "
                param = message.content[5:].strip()
                try:
                    new_volume = int(param)
                    if new_volume < 0 or new_volume > 100:
                        await message.channel.send("Volume must be between 0 and 100")
                    else:
                        current_volume = new_volume
                        set_system_volume(current_volume)
                        await message.channel.send(f"Volume set to {current_volume}%")
                except ValueError:
                    await message.channel.send("Please provide a valid number.")
        '''

