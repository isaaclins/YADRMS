// [./frontend/app/api/compile.ts]
import { NextApiRequest, NextApiResponse } from "next";
import { exec } from "child_process";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      exec(
        "python3 ../backend/languages/python/builder.py",
        (error, stdout, stderr) => {
          if (error) {
            console.error(`exec error: ${error}`);
            res.status(500).json({ message: "Compilation failed." });
            return;
          }
          console.error(`stderr: ${stderr}`);
          res.status(201).json({ message: "Compilation started." });
        }
      );
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: "Invalid JSON data." });
    }
  }
}
