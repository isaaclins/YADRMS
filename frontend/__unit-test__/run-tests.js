const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const waitOn = require('wait-on');
const { promisify } = require('util');

// Colors for better output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  reset: '\x1b[0m',
};

const execPromise = promisify(exec);

// Log file paths
const logDir = path.join(__dirname, '../logs');
const testLogFile = path.join(logDir, 'test-output.log');

// Ensure logs directory exists
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Clear previous logs
if (fs.existsSync(testLogFile)) {
  fs.unlinkSync(testLogFile);
}

const logStream = fs.createWriteStream(testLogFile, { flags: 'a' });

async function startServer() {
  console.log(`${colors.blue}Starting Next.js server...${colors.reset}`);
  
  const server = spawn('npx', ['next', 'dev', '--turbopack'], { 
    shell: true,
    stdio: ['ignore', 'pipe', 'pipe']
  });
  
  // Log server output to file
  server.stdout.pipe(logStream);
  server.stderr.pipe(logStream);
  
  // Wait for server to be ready
  try {
    await waitOn({
      resources: ['http://localhost:3000'],
      timeout: 30000,
    });
    console.log(`${colors.green}Server started successfully!${colors.reset}`);
    return server;
  } catch (error) {
    console.error(`${colors.red}Server failed to start: ${error.message}${colors.reset}`);
    process.exit(1);
  }
}

async function runTests() {
  // Get all test files sorted by name (ensuring order)
  const testDir = __dirname;
  const testFiles = fs.readdirSync(testDir)
    .filter(file => file.endsWith('.test.js'))
    .sort();
  
  console.log(`${colors.blue}================================${colors.reset}`);
  console.log(`${colors.cyan}🧪 Running Tests in Sequence${colors.reset}`);
  console.log(`${colors.blue}================================${colors.reset}`);
  
  let allTestsPassed = true;
  const testResults = [];
  
  for (const testFile of testFiles) {
    const testPath = path.join(testDir, testFile);
    console.log(`${colors.yellow}Running test: ${testFile}${colors.reset}`);
    
    try {
      // Run test and capture output
      const { stdout, stderr } = await execPromise(`npx mocha ${testPath} --reporter spec`);
      logStream.write(`\n----- TEST: ${testFile} -----\n`);
      logStream.write(stdout);
      if (stderr) logStream.write(stderr);
      
      console.log(`${colors.green}✓ ${testFile} passed${colors.reset}`);
      testResults.push({ file: testFile, passed: true, output: stdout });
    } catch (error) {
      logStream.write(`\n----- TEST: ${testFile} -----\n`);
      logStream.write(error.stdout || '');
      logStream.write(error.stderr || '');
      
      console.log(`${colors.red}✗ ${testFile} failed${colors.reset}`);
      console.error(`${colors.red}${error.stderr || error.message}${colors.reset}`);
      testResults.push({ file: testFile, passed: false, output: error.stdout, error: error.stderr });
      allTestsPassed = false;
    }
  }
  
  return { allTestsPassed, testResults };
}

async function displaySummary(results) {
  console.log(`\n${colors.blue}================================${colors.reset}`);
  console.log(`${colors.cyan}📋 Test Summary${colors.reset}`);
  console.log(`${colors.blue}================================${colors.reset}`);
  
  results.testResults.forEach(result => {
    if (result.passed) {
      console.log(`${colors.green}✓ ${result.file} passed${colors.reset}`);
    } else {
      console.log(`${colors.red}✗ ${result.file} failed${colors.reset}`);
    }
  });
  
  console.log(`\n${colors.blue}================================${colors.reset}`);
  console.log(`${colors.cyan}📝 Logs saved to: ${testLogFile}${colors.reset}`);
  console.log(`${colors.blue}================================${colors.reset}`);
  
  if (results.allTestsPassed) {
    console.log(`${colors.green}All tests passed successfully!${colors.reset}`);
  } else {
    console.log(`${colors.red}Some tests failed. Check the logs for details.${colors.reset}`);
  }
}

async function main() {
  let server;
  
  try {
    // Start the server
    server = await startServer();
    
    // Run all tests
    const results = await runTests();
    
    // Display summary
    await displaySummary(results);
    
    return results.allTestsPassed ? 0 : 1;
  } catch (error) {
    console.error(`${colors.red}Error during test execution: ${error.message}${colors.reset}`);
    return 1;
  } finally {
    // Cleanup: Kill the server
    if (server) {
      console.log(`${colors.blue}Shutting down server...${colors.reset}`);
      server.kill();
    }
    
    // Close log stream
    logStream.end();
  }
}

// Run the main function
main()
  .then(exitCode => {
    process.exit(exitCode);
  })
  .catch(error => {
    console.error(`${colors.red}Unhandled error: ${error.message}${colors.reset}`);
    process.exit(1);
  }); 
