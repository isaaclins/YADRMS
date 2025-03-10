import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

// Define constants for directory and file paths
const SETTINGS_DIR = path.join(process.cwd(), "../backend/settings");
const SETTINGS_FILE = "settings.json";
const SETTINGS_FILE_PATH = path.join(SETTINGS_DIR, SETTINGS_FILE);

/**
 * Ensures that the provided directory exists.
 * If not, creates the directory (and any necessary parent directories).
 * @param dirPath - The directory path to check or create.
 */
const ensureDirectoryExists = (dirPath: string): void => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Early return if method is not POST
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed." });
  }

  try {
    // If causeError flag is present, force an error to simulate server issues
    if (req.body.causeError) {
      throw new Error("Forced error for testing");
    }

    // Convert the request body to a formatted JSON string
    const settingsData = JSON.stringify(req.body, null, 2);
    console.log("Saving settings to:", SETTINGS_FILE_PATH);
    console.log("Settings data:", settingsData);

    // Ensure the settings directory exists
    ensureDirectoryExists(SETTINGS_DIR);

    // Write the settings data to the file
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
