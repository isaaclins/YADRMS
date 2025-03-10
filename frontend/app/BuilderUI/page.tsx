"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
export default function BotnetCustomizer() {
  interface BotData {
    token: string;
    guildID: string;
    modules: { [key: string]: boolean };
  }

  const [botData, setBotData] = useState<BotData>({
    token: "",
    guildID: "",
    modules: {},
  });

  useEffect(() => {
    async function fetchModules() { 
        // this function will send the request with the language in the request body.
        // the language will be dynamic and will be selected by the user using a dropdown and be saved as a variable.
        // the response will be the modules available for the selected language.
        // the response will be used to populate the modules object in the botData state.
      try {
        const response = await fetch("/api/modules");
        const moduleList = await response.json();
        const modules = moduleList.reduce((acc, mod) => ({ ...acc, [mod]: false }), {});
        setBotData((prev) => ({ ...prev, modules }));
      } catch (error) {
        console.error("Error fetching modules:", error);
      }
    }

    fetchModules();
  }, []);

  const handleInputChange = (e) => {
    setBotData({ ...botData, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (module) => {
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
          <Input className="bg-gray-800 text-white" name="language" placeholder="Enter language" onChange={handleInputChange} />
          <Label>Token</Label>
          <Input className="bg-gray-800 text-white" name="token" placeholder="Enter token" onChange={handleInputChange} />
          <Label>GuildID</Label>
          <Input className="bg-gray-800 text-white" name="guildID" placeholder="Enter Guild ID" onChange={handleInputChange} />
        </div>

        <div className="mt-4 space-y-2">
          <h3 className="text-lg font-semibold">Modules</h3>
          {Object.keys(botData.modules).map((module) => (
            <div key={module} className="flex items-center gap-2">
              <Checkbox checked={!!botData.modules[module]} onCheckedChange={() => handleCheckboxChange(module)} />
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
          <pre className="text-xs text-gray-300 overflow-auto">{JSON.stringify(botData, null, 2)}</pre>
        </div>
      </Card>
    </div>
  );
}