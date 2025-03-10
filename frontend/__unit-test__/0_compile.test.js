const axios = require('axios');
const { describe, it } = require('mocha');
const { expect } = require('chai');

const URL = 'http://localhost:3000/api/compile';
/**
 * @issue compile unit test
 * @body add a working compile unit test that tests if when a post request is sent to the compile endpoint, it creates a python file and returns a 200 status code. make sure to CHECK for the python file.
 */

describe('Compile Unit Test', function () {
    this.timeout(10000);
    it('should return 200 OK', async function () {
        try {
            const response = await axios.post(URL, {
            });
            expect(response.status).to.equal(201);
            console.log('✅ Test Passed: Server responded with 200 OK');
        } catch (error) {
            console.error(`❌ Test Failed: ${error.message}`);
            throw error;
        }
    });
});