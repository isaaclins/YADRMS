const axios = require("axios");
const { describe, it } = require("mocha");
const { expect } = require("chai");
const fs = require("fs");

const URL = "http://localhost:3000/api/bot/testing";

// create a mock script file path that console logs hello world

// it should first create the script file that just console logs hello world before running the tests BEFORE EACH TEST
// then it should 1. start the bot 2. stop the bot 3. delete the script file and try with a non existent file

describe("Bot Testing API", function () {
  this.timeout(10000);

  it("should start the script file, and kill it after a response is given", async function () {
    const startResponse = await axios.post(URL, {
      script_file: mockedBotScript,
      action: "start",
    });

    expect(startResponse.status).to.equal(200);
    expect(startResponse.data.success).to.be.true;
    expect(startResponse.data.pid).to.be.a("number");

    const stopResponse = await axios.post(URL, {
      script_file: mockedBotScript,
      action: "stop",
    });

    expect(stopResponse.status).to.equal(200);
    expect(stopResponse.data.success).to.be.true;
  });
  beforeEach(function () {
    const mockedBotScript = new File(
      ["console.log('hello world')"],
      "test.py",
      {
        type: "text/plain",
      }
    );

    console.log(mockedBotScript);
  });
  afterEach(function () { // delete the script file after each test
    fs.unlinkSync(mockedBotScript);
  });
});
