const axios = require('axios');
const { describe, it } = require('mocha');
const { expect } = require('chai');

const URL = 'http://localhost:3000';
const endpoints = ['/', '/pythonBuilderUI', '/goBuilderUI', '/javaBuilderUI', '/bashBuilderUI', '/javascriptBuilderUI', '/rustBuilderUI'];

/**
 * @issue test
 * @body test
 */

describe('200 Server Response Test', function () {
    this.timeout(10000); // Set global timeout to 10 seconds

    endpoints.forEach((endpoint) => {
        it(`should return 200 OK for ${endpoint}`, async function () {
            try {
                const response = await axios.get(URL + endpoint);
                expect(response.status).to.equal(200);
                console.log(`✅ Test Passed: Server responded with 200 OK for ${endpoint}`);
            } catch (error) {
                console.error(`❌ Test Failed for ${endpoint}: ${error.message}`);
                throw error;
            }
        });
    });
});
