import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

const SETTINGS_DIR = path.join(process.cwd(), "../backend/settings");
const SETTINGS_FILE = "settings.json";
const SETTINGS_FILE_PATH = path.join(SETTINGS_DIR, SETTINGS_FILE);


const ensureDirectoryExists = (dirPath: string): void => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed." });
  }

  try {
    if (req.body.causeError) {
      throw new Error("Forced error for testing");
    }

    const settingsData = JSON.stringify(req.body, null, 2);
    console.log("Saving settings to:", SETTINGS_FILE_PATH);
    console.log("Settings data:", settingsData);

    ensureDirectoryExists(SETTINGS_DIR);

    fs.writeFile(SETTINGS_FILE_PATH, settingsData, (writeError) => {
      if (writeError) {
        console.error("Error writing file:", writeError.message);
        return res.status(500).json({ message: "Failed to save settings." });
      }
      return res.status(200).json({ message: "Settings saved successfully." });
    });
  } catch (error) {
    console.error("Error saving settings:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}
