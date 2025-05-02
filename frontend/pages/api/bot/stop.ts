import { NextApiRequest, NextApiResponse } from 'next';
import { exec } from 'child_process';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // On Windows, use taskkill
    if (process.platform === 'win32') {
      exec('taskkill /F /IM python.exe', (error) => {
        if (error) {
          console.error(`Error stopping bot: ${error}`);
          return res.status(500).json({ error: error.message });
        }
      });
    } else {
      // On Unix-like systems, use pkill
      exec('pkill -f "python.*run_bot.py"', (error) => {
        if (error) {
          console.error(`Error stopping bot: ${error}`);
          return res.status(500).json({ error: error.message });
        }
      });
    }

    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('Failed to stop bot:', error);
    return res.status(500).json({ error: error.message });
  }
} 
