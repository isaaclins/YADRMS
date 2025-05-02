import { NextApiRequest, NextApiResponse } from 'next';
import { exec } from 'child_process';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get the bot script path - adjust this based on your actual file structure
    const botScriptPath = path.join(process.cwd(), 'backend', 'run_bot.py');
    
    // Execute the bot script
    const botProcess = exec(`python ${botScriptPath}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
    });

    // Store the process ID
    const pid = botProcess.pid;

    return res.status(200).json({ success: true, pid });
  } catch (error: any) {
    console.error('Failed to start bot:', error);
    return res.status(500).json({ error: error.message });
  }
} 
