import fs from "fs";
import path from "path";
import { NextApiRequest, NextApiResponse } from "next";

// Function to handle incoming requests for module data
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return handleInvalidMethod(res);
  }

  const language = extractLanguage(req);
  if (!language) {
    return handleMissingLanguage(res);
  }

  const dirPath = buildDirectoryPath(language);

  try {
    const modules = await getModulesFromDirectory(dirPath);
    return res.status(200).json(modules);
  } catch (error: any) {
    return handleError(res, error);
  }
}

// Step 1: Handle invalid method requests
const handleInvalidMethod = (res: NextApiResponse) => {
  return res.status(405).json({ error: "Method not allowed" });
};

// Step 2: Extract language from the request body
const extractLanguage = (req: NextApiRequest) => req.body.language;

// Step 3: Handle missing language error
const handleMissingLanguage = (res: NextApiResponse) => {
  return res.status(400).json({ error: "Language not provided" });
};

// Step 4: Build the directory path based on language
const buildDirectoryPath = (language: string) =>
  path.join(process.cwd(), "..", "backend", "languages", language, "components", "done");

// Step 5: Get modules from the directory, remove file extensions
const getModulesFromDirectory = (dirPath: string) => {
  const files = fs.readdirSync(dirPath);
  return files.map((file) => file.replace(/\.[^/.]+$/, ""));
};

// Step 6: Handle errors during the process
const handleError = (res: NextApiResponse, error: any) => {
  return res.status(500).json({ error: "Failed to load modules", message: error.message });
};
