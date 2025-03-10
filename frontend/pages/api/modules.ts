import fs from "fs";
import path from "path";
const test = "python"; // This will be dynamic, depending on the language request sent in the request body
export default function handler(req, res) {
  const dirPath = path.join(process.cwd(), "../backend/languages/{"+test+"}/components/done");
  try {
    const files = fs.readdirSync(dirPath);
    res.status(200).json(files.map(file => file.replace(/\.[^/.]+$/, ""))); // Remove extensions
  } catch (error) {
    res.status(500).json({ error: "Failed to load modules", message: error.message });
  }
}
