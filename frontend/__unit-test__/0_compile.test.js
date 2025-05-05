const axios = require("axios");
const { describe, it } = require("mocha");
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
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
};

console.log(`${colors.blue}================================${colors.reset}`);
console.log(`${colors.cyan}🧪 Compile Unit Test${colors.reset}`);
console.log(`${colors.blue}================================${colors.reset}`);      

describe("Compile Unit Test", function () {
  this.timeout(15000); // Increased timeout for Python script execution

  it("should compile bot and return success", async function () {
    try {
      // Minimum data needed for compilation
      const testData = {
        token: "test-token",
        guildID: "test-guild",
        language: "python",
        modules: {
          screenshot: true,
          clipboard: false,
        },
      };

      console.log(
        "Sending test data to compile endpoint:",
        JSON.stringify(testData)
      );

      // Make the request
      const response = await axios.post(URL, testData);

      // Log response data for debugging
      console.log("Response status:", response.status);
      console.log("Response data:", JSON.stringify(response.data));

      // Check status code (accept either 200 or 201)
      expect(response.status).to.be.oneOf([200, 201]);

      // Check for success message
      expect(response.data).to.have.property("message");

      // Verify that a Python file was created in the OUTPUT directory
      const outputDir = path.resolve(__dirname, "../../OUTPUT");

      console.log("Checking for output files in:", outputDir);

      // Give a small delay to ensure file is written
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Check if OUTPUT directory exists
      const dirExists = fs.existsSync(outputDir);
      expect(dirExists, "OUTPUT directory should exist").to.be.true;

      if (dirExists) {
        // Get list of files in OUTPUT directory
        const files = fs.readdirSync(outputDir);
        console.log("Files in OUTPUT directory:", files);

        // Look for Python files
        const pythonFiles = files.filter((file) => file.endsWith(".py"));
        console.log("Python files found:", pythonFiles);

        expect(
          pythonFiles.length,
          "Should have at least one Python file"
        ).to.be.greaterThan(0);
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
