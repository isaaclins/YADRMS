"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const checkEULA = () => {
  if (document.cookie.includes("eula_accepted=false")) {
    window.location.href = "/";
  }
};

interface ScriptFile {
  name: string;
  path: string;
}

interface ScriptFiles {
  [key: string]: any;
  scripts?: ScriptFile[];
}

interface BotData {
  token: string;
  guildID: string;
  language: string;
  modules: { [key: string]: boolean };
}

export default function BuilderUI() {
  const [botStatus, setBotStatus] = useState<"running" | "stopped">("stopped");
  const [scriptFile, setScriptFile] = useState<string>("");
  const [pid, setPid] = useState<number | null>(null);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [scripts, setScripts] = useState<ScriptFiles>({});
  const [noScriptsFound, setNoScriptsFound] = useState(false);
  const [activeView, setActiveView] = useState<"customize" | "test">("customize");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [compileSuccess, setCompileSuccess] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [isPollingLogs, setIsPollingLogs] = useState(false);
  const logsEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [copiedLogs, setCopiedLogs] = useState(false);
  
  const [botData, setBotData] = useState<BotData>({
    token: "",
    guildID: "",
    language: "python",
    modules: {},
  });

  const [languages, setLanguages] = useState<string[]>([]);

  const fetchLanguages = async () => {
    try {
      const response = await fetch("/api/languages", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const languagesList = await response.json();
      setLanguages(languagesList);
      if (
        !languagesList.includes(botData.language) &&
        languagesList.length > 0
      ) {
        setBotData((prev) => ({ ...prev, language: languagesList[0] }));
      }
    } catch (error) {
      console.error("Error fetching languages:", error);
    }
  };

  const fetchScripts = async () => {
    try {
      const response = await fetch("/api/bot/get-all-scripts");
      if (!response.ok) {
        throw new Error("Failed to fetch script files. Please generate a script first.");
      }
      const data = await response.json();
      setScripts(data);
      
      // Check if scripts were found
      setNoScriptsFound(!data.scripts || data.scripts.length === 0);
    } catch (err) {
      console.error("Error fetching scripts:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch script files");
      setNoScriptsFound(true);
    }
  };

  useEffect(() => {
    fetchScripts();
  }, []);

  // Auto-reload script files if none were found
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    if (noScriptsFound && activeView === "test") {
      intervalId = setInterval(fetchScripts, 2000);
    }
    
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [noScriptsFound, activeView]);

  const handleBotAction = async (action: "start" | "stop") => {
    if (!scriptFile) {
      setError("Please select a script file");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      
      // Create request body with PID when stopping
      const requestBody: any = {
        script_file: scriptFile,
        action: action
      };
      
      // Include the PID when stopping
      if (action === "stop" && pid) {
        requestBody.pid = pid;
      }
      
      const response = await fetch("/api/bot/testing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `Failed to ${action} bot`);
      }
      
      if (data.success) {
        if (action === "start") {
          setBotStatus("running");
          setPid(data.pid);
          setLogs([`Started bot with PID: ${data.pid}`]);
          setIsPollingLogs(true);
        } else if (action === "stop") {
          setBotStatus("stopped");
          setLogs(prev => [...prev, `Bot stopped. ${data.message || ''}`]);
          setIsPollingLogs(false);
          setPid(null);
        }
      } else {
        throw new Error(data.error || `Unknown error when trying to ${action} bot`);
      }
    } catch (err) {
      console.error(`Error during ${action} action:`, err);
      setError(err instanceof Error ? err.message : `Failed to ${action} bot`);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchModules = async (language: string) => {
    try {
      const response = await fetch("/api/modules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language }),
      });
      const moduleList = await response.json();
      const modules = createModules(moduleList);
      setBotData((prev) => ({ ...prev, modules }));
    } catch (error) {
      console.error("Error fetching modules:", error);
    }
  };

  const createModules = (moduleList: string[]) =>
    moduleList.reduce((acc, mod) => ({ ...acc, [mod]: false }), {});

  useEffect(() => {
    fetchLanguages();
  }, []);

  useEffect(() => {
    if (botData.language) {
      fetchModules(botData.language);
    }
  }, [botData.language]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBotData({ ...botData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (value: string) => {
    setBotData((prev) => ({ ...prev, language: value }));
  };

  const handleCheckboxChange = (module: string) => {
    setBotData((prev) => ({
      ...prev,
      modules: { ...prev.modules, [module]: !prev.modules[module] },
    }));
  };

  const handleSaveSettings = async () => {
    try {
      setSaveSuccess(false);
      setError("");
      const response = await fetch("/api/save-settings/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(botData),
      });
      if (response.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        throw new Error("Failed to save settings");
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to save settings");
    }
  };

  const handleCompile = async () => {
    try {
      setCompileSuccess(false);
      setError("");
      setIsLoading(true);
      
      const response = await fetch("/api/compile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setCompileSuccess(true);
        fetchScripts(); // Refresh the script list after compiling
        setTimeout(() => setCompileSuccess(false), 3000);
      } else {
        throw new Error(data.error || "Compilation failed");
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Compilation failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearLogs = () => {
    setLogs([]);
  };

  // Polling logs implementation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    const fetchLogs = async () => {
      if (!pid || !isPollingLogs) return;
      
      try {
        const response = await fetch(`/api/bot/logs?pid=${pid}`);
        if (!response.ok) {
          throw new Error("Failed to fetch logs");
        }
        
        const data = await response.json();
        if (data.logs && data.logs.length > 0) {
          setLogs(data.logs);
        }
        
        // Check if process is still running
        if (data.isRunning === false) {
          setIsPollingLogs(false);
          setBotStatus("stopped");
          setPid(null);
          setLogs(prev => [...prev, "Bot process has terminated."]);
        }
      } catch (error) {
        console.error("Error fetching logs:", error);
      }
    };
    
    if (isPollingLogs && pid) {
      // Start with an immediate fetch
      fetchLogs();
      // Then set up polling every 2 seconds
      interval = setInterval(fetchLogs, 2000);
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isPollingLogs, pid]);

  // Scroll logs to bottom when updated
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  const handleCopyLogs = async () => {
    try {
      await navigator.clipboard.writeText(logs.join('\n'));
      setCopiedLogs(true);
      setTimeout(() => setCopiedLogs(false), 2000);
    } catch (err) {
      console.error("Failed to copy logs:", err);
    }
  };

  // Main component render
  return (
    <div className="container mx-auto p-4">
      <Tabs value={activeView} onValueChange={(value) => setActiveView(value as "customize" | "test")}>
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="customize">Configure Bot</TabsTrigger>
          <TabsTrigger value="test">Test Bot</TabsTrigger>
        </TabsList>
        
        <TabsContent value="customize">
          <Card>
            <CardHeader>
              <CardTitle>Bot Configuration</CardTitle>
              <CardDescription>Configure your Discord bot with the desired settings and modules</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              {saveSuccess && (
                <Alert className="mb-4 bg-green-100 border-green-200">
                  <AlertDescription>Settings saved successfully!</AlertDescription>
                </Alert>
              )}
              
              {compileSuccess && (
                <Alert className="mb-4 bg-green-100 border-green-200">
                  <AlertDescription>Compilation successful!</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="token">Discord Bot Token</Label>
                <Input
                  id="token"
                  name="token"
                  value={botData.token}
                  onChange={handleInputChange}
                  placeholder="Enter your Discord bot token"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="guildID">Discord Guild ID</Label>
                <Input
                  id="guildID"
                  name="guildID"
                  value={botData.guildID}
                  onChange={handleInputChange}
                  placeholder="Enter your Discord server ID"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="language">Programming Language</Label>
                <Select value={botData.language} onValueChange={handleSelectChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {languages.map((lang) => (
                        <SelectItem key={lang} value={lang}>
                          {lang}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Modules</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 border rounded-md p-4">
                  {Object.keys(botData.modules).length === 0 ? (
                    <p className="text-sm text-muted-foreground">No modules available for the selected language</p>
                  ) : (
                    Object.keys(botData.modules).map((module) => (
                      <div key={module} className="flex items-center space-x-2">
                        <Checkbox
                          id={module}
                          checked={botData.modules[module]}
                          onCheckedChange={() => handleCheckboxChange(module)}
                        />
                        <Label htmlFor={module} className="font-normal">
                          {module}
                        </Label>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between gap-2">
              <Button onClick={handleSaveSettings} className="w-1/2">
                Save Settings
              </Button>
              <Button onClick={handleCompile} className="w-1/2" disabled={isLoading}>
                {isLoading ? "Compiling..." : "Compile Script"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="test">
          <Card>
            <CardHeader>
              <CardTitle>Bot Testing</CardTitle>
              <CardDescription>Test your compiled bot</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="scriptFile">Select Script</Label>
                <Select value={scriptFile} onValueChange={setScriptFile}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select script file" />
                  </SelectTrigger>
                  <SelectContent>
                    {noScriptsFound ? (
                      <SelectItem value="no-scripts" disabled>
                        No scripts available. Please compile first.
                      </SelectItem>
                    ) : (
                      scripts.scripts?.map((script) => (
                        <SelectItem key={script.path} value={script.path}>
                          {script.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  onClick={() => handleBotAction("start")}
                  disabled={botStatus === "running" || !scriptFile || isLoading}
                  className="flex-1"
                >
                  Start Bot
                </Button>
                <Button
                  onClick={() => handleBotAction("stop")}
                  disabled={botStatus === "stopped" || isLoading}
                  variant="destructive"
                  className="flex-1"
                >
                  Stop Bot
                </Button>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Bot Logs</Label>
                  <div className="flex space-x-2">
                    <Button
                      onClick={handleClearLogs}
                      variant="outline"
                      size="sm"
                      disabled={logs.length === 0}
                    >
                      Clear
                    </Button>
                    <TooltipProvider>
                      <Tooltip open={copiedLogs}>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={handleCopyLogs}
                            variant="outline"
                            size="sm"
                            disabled={logs.length === 0}
                          >
                            Copy
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Copied!</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
                <ScrollArea className="h-[400px] w-full border rounded-md p-4 bg-black text-green-500 font-mono text-sm">
                  {logs.length === 0 ? (
                    <p className="text-gray-500">No logs available. Start the bot to see logs.</p>
                  ) : (
                    logs.map((log, index) => (
                      <div key={index} className="whitespace-pre-wrap mb-1">
                        {log}
                      </div>
                    ))
                  )}
                  <div ref={logsEndRef} />
                </ScrollArea>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
