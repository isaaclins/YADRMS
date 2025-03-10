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

const BotnetCustomizer = () => {
  const [botData, setBotData] = useState<BotData>({
    token: "",
    guildID: "",
    language: "python", // Default language set to "python"
    modules: {},
  });

  // Step 1: Fetch modules based on language
  const fetchModules = async (language: string) => {
    try {
      const response = await fetch("/api/modules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language }),
      });
      const moduleList = await response.json();

      // Step 2: Dynamically create modules object
      const modules = createModules(moduleList);
      setBotData((prev) => ({ ...prev, modules }));
    } catch (error) {
      console.error("Error fetching modules:", error);
    }
  };

  // Step 3: Simplify logic to create modules
  const createModules = (moduleList: string[]) =>
    moduleList.reduce(
      (acc, mod) => ({ ...acc, [mod]: false }),
      {}
    );

  useEffect(() => {
    fetchModules(botData.language);
  }, [botData.language]);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBotData({ ...botData, [e.target.name]: e.target.value });
  };

  // Handle language selection change
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBotData({ ...botData, language: e.target.value });
  };

  // Handle checkbox change for module selection
  const handleCheckboxChange = (module: string) => {
    setBotData((prev) => ({
      ...prev,
      modules: { ...prev.modules, [module]: !prev.modules[module] },
    }));
  };

  return (
    <div className="flex justify-center items-center h-screen bg-black text-white p-4">
      <Card className="w-full max-w-md bg-gray-900 rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold">Botnet Customization</h2>
        <p className="text-sm text-gray-400 mb-4">
          Customize and compile your very own Botnet.
        </p>
        <Button className="bg-gray-700 text-white w-full mb-4">Test</Button>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold">BotData</h3>
          <Label>Language</Label>
          <select
            name="language"
            value={botData.language}
            onChange={handleSelectChange}
            className="w-full bg-gray-800 text-white p-2 rounded-md"
          >
            <option value="python">python</option>
            <option value="go">go</option>
            <option value="java">java</option>
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
          <Button className="bg-gray-700 text-white flex-1">Save Settings</Button>
          <Button className="bg-gray-700 text-white flex-1">Compile</Button>
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

export default BotnetCustomizer;
