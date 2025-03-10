import fs from "fs";
import path from "path";
import { NextApiRequest, NextApiResponse } from "next";

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

const handleInvalidMethod = (res: NextApiResponse) => {
  return res.status(405).json({ error: "Method not allowed" });
};

const extractLanguage = (req: NextApiRequest) => req.body.language;

const handleMissingLanguage = (res: NextApiResponse) => {
  return res.status(400).json({ error: "Language not provided" });
};

const buildDirectoryPath = (language: string) =>
  path.join(process.cwd(), "..", "backend", "languages", language, "components", "done");

const getModulesFromDirectory = (dirPath: string) => {
  const files = fs.readdirSync(dirPath);
  return files.map((file) => file.replace(/\.[^/.]+$/, ""));
};

const handleError = (res: NextApiResponse, error: any) => {
  return res.status(500).json({ error: "Failed to load modules", message: error.message });
};
