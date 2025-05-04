"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { AlertDescription } from "@/components/ui/alert";
import { Alert } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

const ClientCustomizer = () => {
  const [botStatus, setBotStatus] = useState<"running" | "stopped">("stopped");
  const [scriptFile, setScriptFile] = useState<string>("");
  const [pid, setPid] = useState<number | null>(null);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [scripts, setScripts] = useState<ScriptFiles>({});
  const [activeView, setActiveView] = useState<"customize" | "test">("customize");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [compileSuccess, setCompileSuccess] = useState(false);
  const router = useRouter();

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

  useEffect(() => {
    const fetchScripts = async () => {
      try {
        console.log("Fetching script files");
        const response = await fetch("/api/bot/get-all-scripts");
        console.log("Response: ", response);
        if (!response.ok) {
          throw new Error("Failed to fetch script files. Please generate a script first.");
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
        setError("Failed to save settings");
      }
    } catch (error) {
      setError("Error saving settings");
      console.error("Error saving settings:", error);
    }
  };

  const handleCompile = async () => {
    try {
      setCompileSuccess(false);
      setError("");
      const response = await fetch("/api/compile/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(botData),
      });
      if (response.ok) {
        setCompileSuccess(true);
        setTimeout(() => setCompileSuccess(false), 3000);
      } else {
        setError("Failed to compile");
      }
    } catch (error) {
      setError("Error during compilation");
      console.error("Error during compile:", error);
    }
  };

  useEffect(() => {
    checkEULA();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold text-white">YADRMS Builder</h1>
          <p className="text-gray-400">Customize, compile, and test your Discord bot</p>
        </div>
        
        <div className="flex space-x-4 mb-6">
          <Button 
            onClick={() => setActiveView("customize")}
            variant={activeView === "customize" ? "default" : "outline"}
            className="flex-1"
          >
            Configure
          </Button>
          <Button 
            onClick={() => setActiveView("test")}
            variant={activeView === "test" ? "default" : "outline"}
            className="flex-1"
          >
            Test Bot
          </Button>
        </div>
        
        {activeView === "customize" && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-gray-800/50 border-gray-700 rounded-xl shadow-lg backdrop-blur-sm overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4 text-blue-400">Bot Configuration</h2>
                  <p className="text-sm text-gray-400 mb-4">
                    Set up the core settings for your Discord bot
                  </p>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="language" className="text-sm font-medium">
                        Programming Language
                      </Label>
                      <Select value={botData.language} onValueChange={handleSelectChange}>
                        <SelectTrigger className="w-full bg-gray-900 border-gray-700">
                          <SelectValue placeholder="Select a language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Languages</SelectLabel>
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
                      <Label htmlFor="token" className="text-sm font-medium">
                        Bot Token
                      </Label>
                      <Input
                        id="token"
                        name="token"
                        value={botData.token}
                        onChange={handleInputChange}
                        placeholder="Enter your Discord bot token"
                        className="bg-gray-900 border-gray-700"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="guildID" className="text-sm font-medium">
                        Guild ID
                      </Label>
                      <Input
                        id="guildID"
                        name="guildID"
                        value={botData.guildID}
                        onChange={handleInputChange}
                        placeholder="Enter your Discord server ID"
                        className="bg-gray-900 border-gray-700"
                      />
                    </div>
                  </div>
                </div>
              </Card>
              
              <Card className="bg-gray-800/50 border-gray-700 rounded-xl shadow-lg backdrop-blur-sm overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4 text-purple-400">Modules</h2>
                  <p className="text-sm text-gray-400 mb-4">
                    Select the modules to include in your bot
                  </p>
                  
                  <div className="h-[240px] overflow-y-auto pr-4">
                    <div className="space-y-4">
                      {Object.keys(botData.modules).length > 0 ? (
                        Object.keys(botData.modules).map((module) => (
                          <div key={module} className="flex items-start space-x-3 py-2">
                            <Checkbox
                              id={`module-${module}`}
                              checked={!!botData.modules[module]}
                              onCheckedChange={() => handleCheckboxChange(module)}
                              className="mt-0.5"
                            />
                            <div className="grid gap-1.5">
                              <Label
                                htmlFor={`module-${module}`}
                                className="font-medium"
                              >
                                {module}
                              </Label>
                              <p className="text-sm text-gray-400">
                                Enable the {module} functionality
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-400 italic">
                          No modules available for selected language
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-gray-800/50 border-gray-700 rounded-xl shadow-lg backdrop-blur-sm overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4 text-green-400">Live Data</h2>
                  <p className="text-sm text-gray-400 mb-4">
                    Current bot configuration data
                  </p>
                  
                  <div className="h-[200px] w-full overflow-auto rounded-md border border-gray-700 bg-gray-900 p-4">
                    <pre className="text-xs text-gray-300 font-mono">
                      {JSON.stringify(botData, null, 2)}
                    </pre>
                  </div>
                </div>
              </Card>
              
              <Card className="bg-gray-800/50 border-gray-700 rounded-xl shadow-lg backdrop-blur-sm overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4 text-amber-400">Actions</h2>
                  <p className="text-sm text-gray-400 mb-4">
                    Save your settings and compile your bot
                  </p>
                  
                  <div className="space-y-4">
                    {saveSuccess && (
                      <Alert className="bg-green-900/30 border-green-500 text-green-200">
                        <AlertDescription>Settings saved successfully!</AlertDescription>
                      </Alert>
                    )}
                    
                    {compileSuccess && (
                      <Alert className="bg-blue-900/30 border-blue-500 text-blue-200">
                        <AlertDescription>Bot compiled successfully!</AlertDescription>
                      </Alert>
                    )}
                    
                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                    
                    <div className="flex justify-between gap-4 mt-6">
                      <Button
                        onClick={handleSaveSettings}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                      >
                        Save Settings
                      </Button>
                      <Button
                        onClick={handleCompile}
                        className="w-full bg-purple-600 hover:bg-purple-700"
                      >
                        Compile
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
        
        {activeView === "test" && (
          <Card className="bg-gray-800/50 border-gray-700 rounded-xl shadow-lg backdrop-blur-sm overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-green-400">Bot Testing</h2>
              <p className="text-sm text-gray-400 mb-4">
                Test your bot with a compiled script
              </p>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="script-select" className="text-sm font-medium">
                    Script File
                  </Label>
                  <Select value={scriptFile} onValueChange={setScriptFile}>
                    <SelectTrigger id="script-select" className="w-full bg-gray-900 border-gray-700">
                      <SelectValue placeholder="Select a script file" />
                    </SelectTrigger>
                    <SelectContent>
                      {scripts.scripts && scripts.scripts.length > 0 ? (
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
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                      botStatus === "running" 
                        ? "bg-green-600 text-white" 
                        : "bg-red-600 text-white"
                    }`}>
                      {botStatus.toUpperCase()}
                    </span>
                    {pid && <span className="text-xs border border-gray-700 px-2 py-1 rounded-md">PID: {pid}</span>}
                  </div>
                </div>
                
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                <div className="flex justify-between gap-4 mt-6">
                  <Button
                    onClick={() => handleBotAction("start")}
                    disabled={isLoading || botStatus === "running" || !scriptFile}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    {isLoading ? "Processing..." : "Start Bot"}
                  </Button>
                  <Button
                    onClick={() => handleBotAction("stop")}
                    disabled={isLoading || botStatus === "stopped" || !scriptFile}
                    variant="destructive"
                    className="w-full"
                  >
                    {isLoading ? "Processing..." : "Stop Bot"}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ClientCustomizer;
