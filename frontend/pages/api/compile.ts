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
      // Get the absolute path to the builder script
      const rootDir = process.cwd();
      const builderPath = path.resolve(
        rootDir,
        "../backend/languages/python/builder.py"
      );
      const settingsPath = path.resolve(
        rootDir,
        "../backend/settings/settings.json"
      );

      // Make sure the builder script exists
      if (!fs.existsSync(builderPath)) {
        console.error(`Builder script not found at: ${builderPath}`);
        return res.status(404).json({ message: "Builder script not found" });
      }

      // Make sure the settings file exists
      if (!fs.existsSync(settingsPath)) {
        console.error(`Settings file not found at: ${settingsPath}`);
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
      res.status(400).json({ message: "" });
    }
  }
}
