// [frontend/lib/schemas/PythonSchema.ts]
import { z } from "zod";

export const fields = {
  BotData: {
    Token: "",
    GuildID: "",
  },
  Modules: {
    ReverseShell: false,
    FileBrowser: false,
    Downloader: false,
    BSOD: false,
    Clipboard: false,
    AudioControlls: false,
    GhostWriter: false,
    KeyboardShortcuts: false,
    Keylogger: false,
    Obliterator: false,
    PasswordStealer: false,
    Screenshot: false,
    Webcam: false,
    WallpaperChanger: false,
    TTS: false,
  },
};

export const PythonSchema = z.object({
  BotData: z.object({
    Token: z.string(),
    GuildID: z.string(),
  }),
  Modules: z.object({
    ReverseShell: z.boolean(),
    FileBrowser: z.boolean(),
    Downloader: z.boolean(),
    BSOD: z.boolean(),
    Clipboard: z.boolean(),
    AudioControlls: z.boolean(),
    GhostWriter: z.boolean(),
    KeyboardShortcuts: z.boolean(),
    Keylogger: z.boolean(),
    Obliterator: z.boolean(),
    PasswordStealer: z.boolean(),
    Screenshot: z.boolean(),
    Webcam: z.boolean(),
    WallpaperChanger: z.boolean(),
    TTS: z.boolean(),
  }),
});