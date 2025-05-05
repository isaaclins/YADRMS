const axios = require("axios");
const { describe, it, before } = require("mocha");
const { expect } = require("chai");
const fs = require("fs");
const path = require("path");

// it should first check if the OUTPUT directory exists, if not, stop and return an error
// it should then check if the settings.json file exists, if not, stop and return an error
// it should then make a post request to the compile endpoint
// it should then check if a python file was created in the OUTPUT directory
// it should then return a 200 status code

const URL = "http://localhost:3000/api/compile";

const colors = {
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
  reset: "\x1b[0m",
};

console.log(`${colors.blue}================================${colors.reset}`);
console.log(`${colors.cyan}🧪 Compile Unit Test${colors.reset}`);
console.log(`${colors.blue}================================${colors.reset}`);

describe("Compile Unit Test", function () {
  it("should check if the OUTPUT directory exists", function () {
    const dirExists = fs.existsSync(path.join(__dirname, "..", "..", "OUTPUT"));
    expect(dirExists, "OUTPUT directory should exist").to.be.true;
  });
  it("should check if the settings.json file exists", function () {
    const fileExists = fs.existsSync(
      path.join(__dirname, "..", "..", "backend", "settings", "settings.json")
    );
    expect(fileExists, "settings.json file should exist").to.be.true;
  });
  it("should make a post request to the compile endpoint", async function () {
    const response = await axios.post(URL);
    expect(response.status).to.equal(201);
  });

  it("should check if a Python file was created in the OUTPUT directory", function () {
    const outputDir = path.join(__dirname, "..", "..", "OUTPUT");
    const pythonFiles = fs
      .readdirSync(outputDir)
      .filter((file) => file.endsWith(".py"));

    // Check if any Python file exists in the OUTPUT directory
    expect(
      pythonFiles.length > 0,
      "A Python file should exist in the OUTPUT directory"
    ).to.be.true;
  });
});
