import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Get the bot data from the request body
    const botData = req.body;
    
    // Check for test flag to simulate server error
    if (botData._causeError) {
      throw new Error("Simulated server error for testing");
    }
    
    // Make sure we have the required fields
    if (!botData || !botData.token || !botData.guildID) {
      return res.status(400).json({ 
        message: "Missing required fields",
        details: "Request must include token and guildID fields"
      });
    }
    
    // Get the absolute path to the settings file
    const rootDir = process.cwd();
    const settingsDir = path.resolve(rootDir, "../backend/settings");
    const settingsPath = path.join(settingsDir, "settings.json");
    
    // Ensure the settings directory exists
    if (!fs.existsSync(settingsDir)) {
      console.log(`Creating settings directory at ${settingsDir}`);
      fs.mkdirSync(settingsDir, { recursive: true });
    }
    
    // Log the paths for debugging
    console.log(`Settings path: ${settingsPath}`);
    
    // Write the settings file
    fs.writeFileSync(settingsPath, JSON.stringify(botData, null, 2));
    
    console.log("Settings saved to", settingsPath);
    return res.status(200).json({ message: "Settings saved successfully" });
  } catch (error) {
    console.error("Error saving settings:", error);
    return res.status(500).json({ 
      message: "Error saving settings",
      error: error instanceof Error ? error.message : "Unknown error" 
    });
  }
}
