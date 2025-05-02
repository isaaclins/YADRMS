// [./frontend/pages/api/bot/get-all-scripts.ts]
// May 2, 2025
// This file is used to get the scripts for the bot.
// it will return a json object with the script files for the bot.
// example:
// {
//   "python": [{
//     "name": "script1.py",
//     "path": "/path/to/script1.py"
//   }, {
//     "name": "script2.py",
//     "path": "/path/to/script2.py"
//   }],
//   "javascript": [{
//     "name": "script3.js",
//     "path": "/path/to/script3.js"
//   }]
// }

import fs from "fs";
import path from "path";
import { NextApiRequest, NextApiResponse } from "next";

interface ScriptFile {
  name: string;
  path: string;
}

interface ScriptFiles {
  [language: string]: ScriptFile[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Fix: Use path.resolve to get the absolute path to the OUTPUT directory
    const outputDirectory = path.resolve(process.cwd(), "..", "OUTPUT");
    console.log("Looking for scripts in:", outputDirectory);

    // Check if directory exists
    if (!fs.existsSync(outputDirectory)) {
      console.error("OUTPUT directory does not exist:", outputDirectory);
      return res.status(500).json({
        error: "Failed to load script files",
        message: "OUTPUT directory does not exist"
      });
    }

    const scripts = await getScriptFiles(outputDirectory);
    return res.status(200).json(scripts);
  } catch (error: any) {
    console.error("Error loading scripts:", error);
    return res.status(500).json({
      error: "Failed to load script files",
      message: error.message,
    });
  }
}

const getScriptFiles = async (
  outputDirectory: string
): Promise<ScriptFiles> => {
  const scripts: ScriptFiles = {};

  try {
    // Get all files in the OUTPUT directory (non-recursive)
    const files: ScriptFile[] = [];
    const items = fs.readdirSync(outputDirectory, { withFileTypes: true });

    for (const item of items) {
      if (item.isFile()) {
        const fullPath = path.join(outputDirectory, item.name);
        files.push({
          name: item.name,
          path: fullPath,
        });
      }
    }

    // Since all files are in the OUTPUT directory directly, we'll group them under "scripts"
    if (files.length > 0) {
      scripts["scripts"] = files;
    }

    return scripts;
  } catch (error) {
    console.error("Error reading OUTPUT directory:", error);
    return {};
  }
};
