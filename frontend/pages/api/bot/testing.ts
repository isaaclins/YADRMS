// [./frontend/pages/api/bot/testing.ts]
// May 2, 2025
// this file is used to start and stop the bot. it will be called by the frontend when the user clicks the start button.
// it will either start or stop the bot depending on the request.
//
// here is what the api should expect:
//
// {
//   "script_file": "path/to/the/script/directory/file.py",
//   "action": "start"
// }
//
// or
//
// {
//   "script_file": "path/to/the/script/directory/file.py",
//   "action": "stop"
// }

// the file will be started in the background and the process ID will be returned to the frontend.

import { NextApiRequest, NextApiResponse } from "next";
import { exec } from "child_process";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { script_file, action } = req.body;

  if (action === "start") {
    try {
      const botProcess = exec(`python3 ${script_file}`);
      return res.status(200).json({ success: true, pid: botProcess.pid });
    } catch (error) {
      return res.status(500).json({ error: "Failed to start bot: " + error });
    }
  }

  if (action === "stop") {
    try {
      const botProcess = exec(`pkill -f "python3 ${script_file}"`);
      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(500).json({ error: "Failed to stop bot: " + error });
    }
  }

  return res.status(400).json({ error: "Invalid action" });
}
