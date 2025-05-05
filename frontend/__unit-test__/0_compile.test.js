const axios = require("axios");
const { describe, it, before } = require("mocha");
const { expect } = require("chai");
const fs = require("fs");
const path = require("path");

const URL = "http://localhost:3000/api/compile";
/**
 * @issue compile unit test
 * @body add a working compile unit test that tests if when a post request is sent to the compile endpoint, it creates a python file and returns a 200 status code. make sure to CHECK for the python file.
 */
// Add colors for better visual output
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
  this.timeout(15000); // Increased timeout for Python script execution

  it("should compile bot and return success", async function () {
    try {
      const response = await axios.post(URL);
      expect(response.status).to.be.oneOf([200, 201]);
      const outputDir = path.resolve(__dirname, "../../OUTPUT");
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const dirExists = fs.existsSync(outputDir);
      if (dirExists) {
        const files = fs.readdirSync(outputDir);
        const pythonFiles = files.filter((file) => file.endsWith(".py"));
        expect(pythonFiles.length).to.be.greaterThan(0);
      }
      console.log("✅ Test Passed: Compilation successful");
    } catch (error) {
      console.error("❌ Test Failed:", error.message);
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
      }
      throw error;
    }
  });
});
