const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('Testing backend setup...');

// Test 1: Check if backend dependencies are installed
exec('cd src/backend && npm list', (error, stdout, stderr) => {
  if (error) {
    console.log('Test 1: Backend dependencies check - FAILED');
    console.log('Installing backend dependencies...');
    
    exec('cd src/backend && npm install', (installError, installStdout, installStderr) => {
      if (installError) {
        console.log('Failed to install backend dependencies:', installError.message);
        return;
      }
      console.log('Backend dependencies installed successfully');
    });
  } else {
    console.log('Test 1: Backend dependencies check - PASSED');
  }
});

// Test 2: Try to build the backend
exec('cd src/backend && npm run build', (error, stdout, stderr) => {
  if (error) {
    console.log('Test 2: Backend build - FAILED');
    console.log('Error:', error.message);
    if (stderr) console.log('Stderr:', stderr);
  } else {
    console.log('Test 2: Backend build - PASSED');
    console.log('Backend built successfully');
  }
  
  // Test 3: Check if dist folder exists
  const distPath = path.join(__dirname, 'src', 'backend', 'dist');
  
  fs.access(distPath, fs.constants.F_OK, (err) => {
    if (err) {
      console.log('Test 3: Dist folder check - FAILED');
      console.log('Dist folder does not exist');
    } else {
      console.log('Test 3: Dist folder check - PASSED');
      console.log('Dist folder exists');
      
      // List files in dist folder
      fs.readdir(distPath, (err, files) => {
        if (err) {
          console.log('Could not list dist folder contents');
        } else {
          console.log('Dist folder contents:', files);
        }
      });
    }
  });
});