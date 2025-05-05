// [./frontend/app/api/compile.ts]
import { NextApiRequest, NextApiResponse } from "next";
import { exec } from "child_process";
import path from "path";
import fs from "fs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Get the absolute path to the builder script
    const rootDir = process.cwd();
    const builderPath = path.resolve(rootDir, "../backend/languages/python/builder.py");
    const outputDir = path.resolve(rootDir, "../OUTPUT");
    const settingsPath = path.resolve(rootDir, "../backend/settings/settings.json");
    
    // Ensure the OUTPUT directory exists
    if (!fs.existsSync(outputDir)) {
      console.log(`Creating OUTPUT directory at ${outputDir}`);
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Save request data to settings.json
    try {
      // Make sure the settings directory exists
      const settingsDir = path.dirname(settingsPath);
      if (!fs.existsSync(settingsDir)) {
        fs.mkdirSync(settingsDir, { recursive: true });
      }
      
      // Process modules to handle both "modules" and "Modules" formats
      const modules = req.body.modules || {};
      
      // Prepare settings object
      const settingsData = {
        token: req.body.token || "dummy-token",
        guildID: req.body.guildID || "dummy-guild",
        language: req.body.language || "python",
        modules: modules,
        // Also include a Modules key for compatibility with different case formats
        Modules: modules
      };
      
      // Write the settings file with request data
      fs.writeFileSync(settingsPath, JSON.stringify(settingsData, null, 2));
      
      console.log(`Settings saved to ${settingsPath}`);
    } catch (error) {
      console.error(`Error saving settings: ${error}`);
      return res.status(500).json({ 
        message: "Failed to save settings", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
    
    // Log the paths for debugging
    console.log(`Builder path: ${builderPath}`);
    console.log(`Working directory: ${rootDir}`);
    
    // Make sure the builder script exists
    if (!fs.existsSync(builderPath)) {
      console.error(`Builder script not found at: ${builderPath}`);
      return res.status(404).json({ message: "Builder script not found" });
    }

    // Execute the builder script
    exec(`python3 "${builderPath}"`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Exec error: ${error.message}`);
        return res.status(500).json({ 
          message: "Compilation failed", 
          error: error.message,
          stdout,
          stderr 
        });
      }
      
      if (stderr) {
        console.warn(`Script warnings: ${stderr}`);
      }
      
      console.log(`Builder output: ${stdout}`);
      
      // Check if the script output contains success message
      if (stdout.includes("Compilation successful") || !stderr) {
        return res.status(201).json({ 
          message: "Compilation successful", 
          output: stdout 
        });
      } else {
        return res.status(200).json({ 
          message: "Compilation completed with warnings", 
          warnings: stderr,
          output: stdout
        });
      }
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    // Make sure to always send a response
    return res.status(500).json({ 
      message: "Server error during compilation",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
}
