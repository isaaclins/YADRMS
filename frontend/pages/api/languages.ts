import fs from "fs";
import path from "path";
import { NextApiRequest, NextApiResponse } from "next";

// API handler for fetching language folders
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Allow only GET requests
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const languagesDirectory = buildLanguagesDirectoryPath();

  try {
    const languages = getLanguageFolders(languagesDirectory);
    return res.status(200).json(languages);
  } catch (error: any) {
    return handleError(res, error);
  }
}

// Build the directory path for the languages folder
const buildLanguagesDirectoryPath = (): string =>
  path.join(process.cwd(), "..", "backend", "languages");

// Retrieve folder names from the languages directory
const getLanguageFolders = (directoryPath: string): string[] => {
  const directoryItems = fs.readdirSync(directoryPath, { withFileTypes: true });
  // Filter only directories (each representing a language)
  return directoryItems
    .filter((item) => item.isDirectory())
    .map((dir) => dir.name);
};

// Handle errors during directory reading
const handleError = (res: NextApiResponse, error: any) => {
  return res
    .status(500)
    .json({ error: "Failed to load languages", message: error.message });
};
