// [./frontend/pages/api/bot/logs.ts]
// This API endpoint fetches logs from a running bot process

import { NextApiRequest, NextApiResponse } from "next";
import { exec } from "child_process";
import fs from "fs";
import path from "path";
import os from "os";

// Store stdout and stderr for each process
// Keep track of how many lines we've read for each process
const processLogs: { [pid: string]: string[] } = {};
const processLogCounts: { [pid: string]: number } = {};
const processExitStatus: { [pid: string]: boolean } = {};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { pid } = req.query;

  if (!pid || Array.isArray(pid)) {
    return res.status(400).json({ error: "Invalid PID" });
  }

  // Initialize logs array for this PID if not already there
  if (!processLogs[pid]) {
    processLogs[pid] = [];
    processLogCounts[pid] = 0;
    processExitStatus[pid] = false;
  }

  // If we've already determined the process has exited, return that status
  if (processExitStatus[pid]) {
    return res.status(200).json({ 
      logs: [], 
      active: false,
      message: "Process has exited" 
    });
  }

  try {
    // Check if process is still running
    const isRunning = await checkIfProcessIsRunning(pid);
    
    // Get the log file path
    const logFile = path.join(os.tmpdir(), `bot_${pid}.log`);
    
    // Check if the log file exists
    const logFileExists = fs.existsSync(logFile);
    
    // The process is no longer running
    if (!isRunning) {
      let finalLogs: string[] = [];
      
      // Get any remaining logs if the file exists
      if (logFileExists) {
        try {
          finalLogs = await getNewLogsFromFile(logFile, processLogCounts[pid]);
          
          if (finalLogs.length > 0) {
            processLogs[pid].push(...finalLogs);
            processLogCounts[pid] += finalLogs.length;
          }
          
          // Check if log file contains exit message
          const fileContent = fs.readFileSync(logFile, 'utf8');
          if (fileContent.includes('Process exited with code')) {
            processExitStatus[pid] = true;
          }
        } catch (e) {
          console.error("Error reading final logs:", e);
        }
      }
      
      const returnLogs = finalLogs.length > 0 ? finalLogs : [];
      
      // Mark the process as exited for future requests
      processExitStatus[pid] = true;
      
      return res.status(200).json({ 
        logs: returnLogs, 
        active: false,
        message: "Process is no longer running" 
      });
    }

    // If log file doesn't exist but process is running, wait for it
    if (!logFileExists) {
      if (processLogs[pid].length === 0) {
        processLogs[pid].push("Waiting for process output...");
        return res.status(200).json({ logs: ["Waiting for process output..."], active: true });
      }
      return res.status(200).json({ logs: [], active: true });
    }

    // Read log file for new lines since last check
    const newLines = await getNewLogsFromFile(logFile, processLogCounts[pid]);
    
    // Check if the log file indicates the process has exited
    if (newLines.some(line => line.includes('Process exited with code'))) {
      processExitStatus[pid] = true;
    }
    
    // Add new lines to stored logs and return only the new lines
    if (newLines.length > 0) {
      // Don't store the lines in memory, just update the count
      processLogCounts[pid] += newLines.length;
      
      return res.status(200).json({ 
        logs: newLines,
        active: !processExitStatus[pid]
      });
    } else {
      // No new logs
      return res.status(200).json({ 
        logs: [], 
        active: !processExitStatus[pid]
      });
    }
  } catch (error) {
    console.error("Error retrieving logs:", error);
    return res.status(500).json({ 
      error: "Failed to retrieve logs", 
      details: error instanceof Error ? error.message : String(error) 
    });
  }
}

// Helper function to get new lines from a log file
async function getNewLogsFromFile(logFile: string, currentLineCount: number): Promise<string[]> {
  try {
    const fileContents = fs.readFileSync(logFile, "utf-8");
    const allLines = fileContents.split("\n");
    
    // Get new lines (start from the current line count)
    const newLines = allLines.slice(currentLineCount);
    
    // Filter out empty lines
    return newLines.filter(line => line.trim() !== "");
  } catch (error) {
    console.error("Error reading log file:", error);
    return ["Error reading log file: " + (error instanceof Error ? error.message : String(error))];
  }
}

async function checkIfProcessIsRunning(pid: string): Promise<boolean> {
  return new Promise((resolve) => {
    exec(`ps -p ${pid} -o pid=`, (error, stdout, stderr) => {
      if (error || stderr) {
        // Process not found or error
        resolve(false);
      } else {
        // Process exists
        resolve(stdout.trim() !== "");
      }
    });
  });
} 
