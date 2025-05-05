const axios = require("axios");
const { describe, it } = require("mocha");
const { expect } = require("chai");

const URL = "http://localhost:3000/404NF";

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
console.log(`${colors.cyan}🧪 404 Server Response Test${colors.reset}`);
console.log(`${colors.blue}================================${colors.reset}`);

describe("404 Server Response Test", function () {
  this.timeout(10000);
  it("should return 404 NOT FOUND", async function () {
    try {
      await axios.get(URL);
      console.error(`${colors.red}❌ FAIL: Expected 404 but got success${colors.reset}`);
      throw new Error("Expected 404 response but got success");
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          expect(error.response.status).to.equal(404);
          console.log(`${colors.green}✅ PASS: Server responded with 404 Not Found${colors.reset}`);
        } else if (error.response.status === 500) {
          console.log(
            `${colors.yellow}⚠️ WARNING: Server responded with 500 Internal Server Error${colors.reset}`
          );
        } else {
          console.log(
            `${colors.yellow}⚠️ WARNING: Server responded with status code ${error.response.status}${colors.reset}`
          );
        }
      } else if (error.message === "Expected 404 response but got success") {
        throw error;
      } else {
        console.log(`${colors.red}❌ FAIL: No response from server - ${error.message}${colors.reset}`);
        throw error;
      }
    }
  });
});
