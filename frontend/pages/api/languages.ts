import fs from "fs";
import path from "path";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
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

const buildLanguagesDirectoryPath = (): string =>
  path.join(process.cwd(), "..", "backend", "languages");

const getLanguageFolders = (directoryPath: string): string[] => {
  const directoryItems = fs.readdirSync(directoryPath, { withFileTypes: true });
  return directoryItems
    .filter((item) => item.isDirectory())
    .map((dir) => dir.name);
};

const handleError = (res: NextApiResponse, error: any) => {
  return res
    .status(500)
    .json({ error: "Failed to load languages", message: error.message });
};
