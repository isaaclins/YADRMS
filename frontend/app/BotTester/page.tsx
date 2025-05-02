"use client";
// this page is used to test the bot. it will be used to start and stop the bot.
// it will also be used to test the bot's response to a message.

// it should send a request to the api/bot/testing endpoint to start and stop the bot.
// it should also send a request to the api/bot/testing endpoint to get the bot's response to a message.

// make a dropdown for the user to select the script file.
// the dropdown should be populated with the script files from the api/bot/get-all-scripts endpoint.
// here is an example of an expected response from the api/bot/get-all-scripts endpoint:
// {
//   "python": [{
//     "name": "script1.py",
//     "path": "/path/to/script1.py"
//   }, {
//     "name": "script2.py",
//     "path": "/path/to/script2.py"
//   }],
//   "javascript": [{
//     "name": "script3.js",
//     "path": "/path/to/script3.js"
//   }]
// }


import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ScriptFile {
  name: string;
  path: string;
}

interface ScriptFiles {
  [language: string]: ScriptFile[];
}

export default function BotTester() {
  const [botStatus, setBotStatus] = useState<"running" | "stopped">("stopped");
  const [scriptFile, setScriptFile] = useState<string>("");
  const [pid, setPid] = useState<number | null>(null);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [scripts, setScripts] = useState<ScriptFiles>({});

  useEffect(() => {
    const fetchScripts = async () => {
        try {
        console.log("Fetching script files");
            const response = await fetch("/api/bot/get-all-scripts");
            console.log("Response: ", response);
        if (!response.ok) {
          throw new Error("Failed to fetch script files");
        }
        const data = await response.json();
        setScripts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch script files");
      }
    };

    fetchScripts();
  }, []);

  const handleBotAction = async (action: "start" | "stop") => {
    if (!scriptFile) {
      setError("Please select a script file");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      
      const response = await fetch("/api/bot/testing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          script_file: scriptFile,
          action: action
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `Failed to ${action} bot`);
      }
      
      if (data.success) {
        setBotStatus(action === "start" ? "running" : "stopped");
        if (action === "start") {
          setPid(data.pid);
        } else {
          setPid(null);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to ${action} bot`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Bot Tester</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col gap-4">
              <Select value={scriptFile} onValueChange={setScriptFile}>
                <SelectTrigger className="max-w-md">
                  <SelectValue placeholder="Select a script file" />
                </SelectTrigger>
                <SelectContent>
                  {scripts.scripts?.length > 0 ? (
                    scripts.scripts.map((file) => (
                      <SelectItem key={file.path} value={file.path}>
                        {file.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-scripts" disabled>
                      No scripts available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              
              <div className="flex items-center gap-4">
                <Button
                  onClick={() => handleBotAction("start")}
                  disabled={isLoading || botStatus === "running" || !scriptFile}
                  variant="default"
                >
                  {isLoading ? "Processing..." : "Start Bot"}
                </Button>
                <Button
                  onClick={() => handleBotAction("stop")}
                  disabled={isLoading || botStatus === "stopped" || !scriptFile}
                  variant="destructive"
                >
                  {isLoading ? "Processing..." : "Stop Bot"}
                </Button>
                <span className="ml-4">
                  Status: <span className={`font-bold ${botStatus === "running" ? "text-green-600" : "text-red-600"}`}>
                    {botStatus.toUpperCase()}
                  </span>
                </span>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {pid && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Bot Information:</h3>
                <pre className="bg-gray-100 p-4 rounded-lg">
                  Process ID: {pid}
                </pre>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
