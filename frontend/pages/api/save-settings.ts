import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const datajson = JSON.stringify(req.body, null, 2);
      const dirPath = path.join(process.cwd(), "../backend/settings");
      const filePath = path.join(dirPath, "settings.json");
      console.log("Saving settings to:", filePath);
      console.log("Settings data:", datajson);

      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }

      fs.writeFile(filePath, datajson, (err) => {
        if (err) {
          console.error("Error writing file:", err.message);
          res.status(500).json({ message: "Failed to save settings." });
          return;
        }
        res.status(200).json({ message: "Settings saved successfully." });
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  } else {
    res.status(405).json({ message: "Method not allowed." });
  }
}
