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
import { exec, spawn } from "child_process";
import fs from "fs";
import path from "path";
import os from "os";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { script_file, action } = req.body;
  
  if (!script_file) {
    return res.status(400).json({ error: "Missing script_file parameter" });
  }
  
  if (!action || (action !== "start" && action !== "stop")) {
    return res.status(400).json({ error: "Invalid action. Must be 'start' or 'stop'" });
  }

  if (action === "start") {
    try {
      // Create a log file to capture output with a timestamp to avoid conflicts
      const timestamp = Date.now();
      
      // Use spawn instead of exec for better output handling
      // Set Python to run unbuffered (-u flag) to get real-time output
      const botProcess = spawn('python3', ['-u', script_file], {
        detached: true, // Run in background
        stdio: ['ignore', 'pipe', 'pipe'] // Redirect stdout and stderr to pipes
      });
      
      // Ensure we have a valid PID
      if (!botProcess.pid) {
        throw new Error("Failed to get process ID");
      }
      
      // Create a log file specifically for this process
      const processLogFile = path.join(os.tmpdir(), `bot_${botProcess.pid}.log`);
      
      // Create a write stream for the log file (append mode)
      const logStream = fs.createWriteStream(processLogFile, { flags: 'a' });
      
      // Write initial startup message
      logStream.write(`Bot process started at ${new Date().toISOString()}\n`);
      logStream.write(`Command: python3 -u ${script_file}\n`);
      logStream.write(`PID: ${botProcess.pid}\n`);
      logStream.write("--- Output begins below ---\n");
      
      // Set up data handlers for stdout and stderr with proper encoding
      botProcess.stdout.setEncoding('utf8');
      botProcess.stderr.setEncoding('utf8');
      
      // Pipe stdout to log file
      botProcess.stdout.on('data', (data) => {
        logStream.write(data);
      });
      
      // Pipe stderr to log file
      botProcess.stderr.on('data', (data) => {
        logStream.write(`[ERROR] ${data}`);
      });
      
      // Handle process exit
      botProcess.on('exit', (code, signal) => {
        logStream.write(`\n--- Process exited with code ${code} and signal ${signal} at ${new Date().toISOString()} ---\n`);
        logStream.end();
      });
      
      // Handle unexpected errors
      botProcess.on('error', (err) => {
        logStream.write(`\n--- Process error: ${err.message} at ${new Date().toISOString()} ---\n`);
        logStream.end();
      });
      
      // Detach the process so it continues running after the API call ends
      botProcess.unref();
      
      return res.status(200).json({ success: true, pid: botProcess.pid });
    } catch (error) {
      console.error("Error starting bot:", error);
      return res.status(500).json({ 
        error: "Failed to start bot", 
        details: error instanceof Error ? error.message : String(error)
      });
    }
  }

  if (action === "stop") {
    try {
      // First check if the process is running using its PID from the frontend
      const pidFromQuery = req.body.pid;
      
      if (pidFromQuery) {
        const isRunning = await new Promise<boolean>((resolve) => {
          exec(`ps -p ${pidFromQuery} -o pid=`, (error, stdout) => {
            resolve(stdout.trim() !== "");
          });
        });
        
        if (!isRunning) {
          console.log(`Process ${pidFromQuery} is already stopped`);
          return res.status(200).json({ 
            success: true, 
            message: `Process ${pidFromQuery} is already stopped` 
          });
        }
        
        // If the process is running, try to kill it directly
        try {
          process.kill(parseInt(pidFromQuery), 'SIGTERM');
          
          // Add stop message to the log file
          const logFile = path.join(os.tmpdir(), `bot_${pidFromQuery}.log`);
          if (fs.existsSync(logFile)) {
            fs.appendFileSync(logFile, `\n--- Process ${pidFromQuery} terminated by user at ${new Date().toISOString()} ---\n`);
          }
          
          return res.status(200).json({ 
            success: true, 
            message: `Stopped process ${pidFromQuery}` 
          });
        } catch (killError) {
          console.error(`Error stopping process ${pidFromQuery}:`, killError);
          // If direct kill fails, fall through to the pattern matching approach
        }
      }
      
      // Fixed command to reliably find and kill Python processes
      exec(`ps aux | grep "python3 -u ${script_file}" | grep -v grep`, (error, stdout, stderr) => {
        // If error occurs and no output, it means no processes were found
        if ((error || stderr) && !stdout.trim()) {
          console.log("No matching processes found for script:", script_file);
          return res.status(200).json({ 
            success: true, 
            message: "No running processes found for this script" 
          });
        }
        
        // Parse the output to get PIDs
        const processLines = stdout.trim().split('\n');
        const pids: string[] = [];
        
        processLines.forEach(line => {
          const parts = line.trim().split(/\s+/);
          if (parts.length > 1) {
            pids.push(parts[1]); // PID is in the second column
          }
        });
        
        if (pids.length === 0) {
          return res.status(200).json({ 
            success: true, 
            message: "No running processes found for this script" 
          });
        }
        
        console.log(`Found ${pids.length} processes to kill:`, pids);
        
        // Kill each process
        pids.forEach(pid => {
          try {
            // Write stopping message to log file
            const logFile = path.join(os.tmpdir(), `bot_${pid}.log`);
            if (fs.existsSync(logFile)) {
              fs.appendFileSync(logFile, `\n--- Process ${pid} terminated by user at ${new Date().toISOString()} ---\n`);
            }
            
            console.log(`Killing process ${pid}`);
            
            // Try to kill the process using SIGTERM first
            try {
              process.kill(parseInt(pid), 'SIGTERM');
            } catch (killError) {
              // If SIGTERM fails, try SIGKILL
              console.log(`SIGTERM failed for process ${pid}, trying SIGKILL`);
              process.kill(parseInt(pid), 'SIGKILL');
            }
          } catch (killError) {
            console.error(`Error killing process ${pid}:`, killError);
          }
        });
        
        return res.status(200).json({ 
          success: true, 
          message: `Stopped ${pids.length} process(es)` 
        });
      });
    } catch (error) {
      console.error("Error stopping bot:", error);
      return res.status(500).json({ 
        error: "Failed to stop bot", 
        details: error instanceof Error ? error.message : String(error)
      });
    }
  } else {
    return res.status(400).json({ error: "Invalid action. Must be 'start' or 'stop'" });
  }
}
