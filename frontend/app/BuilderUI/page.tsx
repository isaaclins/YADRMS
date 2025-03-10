"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BotData {
  token: string;
  guildID: string;
  language: string;
  modules: { [key: string]: boolean };
}

const ClientCustomizer = () => {
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
      if (!languagesList.includes(botData.language) && languagesList.length > 0) {
        setBotData((prev) => ({ ...prev, language: languagesList[0] }));
      }
    } catch (error) {
      console.error("Error fetching languages:", error);
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

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBotData({ ...botData, language: e.target.value });
  };

  const handleCheckboxChange = (module: string) => {
    setBotData((prev) => ({
      ...prev,
      modules: { ...prev.modules, [module]: !prev.modules[module] },
    }));
  };

  const handleSaveSettings = async () => {
    try {
      const response = await fetch("/api/save-settings/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(botData),
      });
      if (response.ok) {
        console.log("Settings saved successfully!");
      } else {
        console.error("Failed to save settings.");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  };

  const handleCompile = async () => {
    try {
      const response = await fetch("/api/compile/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(botData),
      });
      if (response.ok) {
        console.log("Compile request sent successfully!");
      } else {
        console.error("Failed to compile.");
      }
    } catch (error) {
      console.error("Error during compile:", error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-black text-white p-4">
      <Card className="w-full max-w-md bg-gray-900 rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold">Client Customization</h2>
        <p className="text-sm text-gray-400 mb-4">
          Customize and compile your very own Client.
        </p>
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">BotData</h3>
          <Label>Language</Label>
          <select
            name="language"
            value={botData.language}
            onChange={handleSelectChange}
            className="w-full bg-gray-800 text-white p-2 rounded-md"
          >
            {languages.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>

          <Label>Token</Label>
          <Input
            className="bg-gray-800 text-white"
            name="token"
            placeholder="Enter token"
            onChange={handleInputChange}
          />
          <Label>GuildID</Label>
          <Input
            className="bg-gray-800 text-white"
            name="guildID"
            placeholder="Enter Guild ID"
            onChange={handleInputChange}
          />
        </div>

        <div className="mt-4 space-y-2">
          <h3 className="text-lg font-semibold">Modules</h3>
          {Object.keys(botData.modules).map((module) => (
            <div key={module} className="flex items-center gap-2">
              <Checkbox
                checked={!!botData.modules[module]}
                onCheckedChange={() => handleCheckboxChange(module)}
              />
              <Label>{module}</Label>
            </div>
          ))}
        </div>

        <div className="mt-6 flex gap-2">
          <Button onClick={handleSaveSettings} className="bg-gray-700 text-white flex-1">
            Save Settings
          </Button>
          <Button onClick={handleCompile} className="bg-gray-700 text-white flex-1">
            Compile
          </Button>
        </div>

        <div className="mt-6 p-4 bg-gray-800 rounded-lg">
          <h3 className="text-lg font-semibold">Live Data</h3>
          <pre className="text-xs text-gray-300 overflow-auto">
            {JSON.stringify(botData, null, 2)}
          </pre>
        </div>
      </Card>
    </div>
  );
};

export default ClientCustomizer;
