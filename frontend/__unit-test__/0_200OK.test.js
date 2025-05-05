const axios = require("axios");
const { describe, it } = require("mocha");
const { expect } = require("chai");

const URL = "http://localhost:3000";
const endpoints = ["/", "/BuilderUI"];

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
console.log(`${colors.cyan}🧪 200 Server Response Test${colors.reset}`);
console.log(`${colors.blue}================================${colors.reset}`);

describe("200 Server Response Test", function () {
  this.timeout(10000);

  endpoints.forEach((endpoint) => {
    it(`should return 200 OK for ${endpoint}`, async function () {
      try {
        const response = await axios.get(URL + endpoint);
        expect(response.status).to.equal(200);
        console.log(
          `${colors.green}✅ PASS: Server responded with 200 OK for ${endpoint}${colors.reset}`
        );
      } catch (error) {
        console.error(`${colors.red}❌ FAIL for ${endpoint}: ${error.message}${colors.reset}`);
        if (error.response) {
          console.error(`${colors.yellow}   Status: ${error.response.status}${colors.reset}`);
        }
        throw error;
      }
    });
  });
});
