// [./frontend/app/api/compile.ts]
import { NextApiRequest, NextApiResponse } from "next";
import { exec } from "child_process";
import path from "path";
import fs from "fs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      // Get the absolute path to the builder script and settings
      const rootDir = process.cwd();
      
      // Try multiple possible paths for files
      const possibleBuilderPaths = [
        path.resolve(rootDir, "../backend/languages/python/builder.py"),
        path.resolve(rootDir, "backend/languages/python/builder.py")
      ];
      
      const possibleSettingsPaths = [
        path.resolve(rootDir, "../backend/settings/settings.json"),
        path.resolve(rootDir, "backend/settings/settings.json")
      ];
      
      // Find the first valid builder path
      const builderPath = possibleBuilderPaths.find(p => fs.existsSync(p));
      if (!builderPath) {
        console.error(`Builder script not found at any of these paths: ${possibleBuilderPaths.join(', ')}`);
        return res.status(404).json({ message: "Builder script not found" });
      }
      
      // Find the first valid settings path
      const settingsPath = possibleSettingsPaths.find(p => fs.existsSync(p));
      if (!settingsPath) {
        console.error(`Settings file not found at any of these paths: ${possibleSettingsPaths.join(', ')}`);
        return res.status(404).json({ message: "Settings file not found" });
      }

      exec(`python3 "${builderPath}"`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Exec error: ${error.message}`);
          return res.status(500).json({
            message: "Compilation failed",
            error: error.message,
            stdout,
            stderr,
          });
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
        res.status(201).json({ message: "Compilation started." });
      });
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: "An error occurred during compilation" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
