const fs = require('fs');
const path = require('path');

function analyzeAuthLogs() {
  const logFile = path.join(process.cwd(), 'logs', 'auth.log');
  
  if (!fs.existsSync(logFile)) {
    console.error('No log file found at:', logFile);
    return;
  }

  const logs = fs.readFileSync(logFile, 'utf8')
    .split('\n')
    .filter(line => line.trim())
    .map(line => {
      try {
        const [timestamp, level, ...rest] = line.split('] ');
        const message = rest.join('] ').trim();
        return {
          timestamp: timestamp.substring(1),
          level: level.substring(1),
          message
        };
      } catch (e) {
        return null;
      }
    })
    .filter(log => log);

  // Analyze auth flow
  console.log('\n=== Auth Flow Analysis ===\n');
  
  const authFlows = [];
  let currentFlow = [];
  
  for (const log of logs) {
    if (log.message.includes('Starting auth callback handling')) {
      if (currentFlow.length > 0) {
        authFlows.push(currentFlow);
      }
      currentFlow = [log];
    } else if (currentFlow.length > 0) {
      currentFlow.push(log);
    }
  }
  
  if (currentFlow.length > 0) {
    authFlows.push(currentFlow);
  }

  // Analyze each auth flow
  authFlows.forEach((flow, index) => {
    console.log(`\nAuth Flow #${index + 1}:`);
    
    let hasCode = false;
    let exchangeSuccess = false;
    let sessionEstablished = false;
    let errors = [];
    
    flow.forEach(log => {
      const msg = log.message.toLowerCase();
      
      if (msg.includes('auth parameters received')) {
        try {
          const data = JSON.parse(msg.split('\n')[1]);
          hasCode = data.hasCode;
          console.log('- Received auth parameters:', 
            `code=${data.hasCode}`,
            `token=${data.hasAccessToken}`);
        } catch (e) {}
      }
      
      if (msg.includes('code exchange result')) {
        try {
          const data = JSON.parse(msg.split('\n')[1]);
          exchangeSuccess = data.success;
          console.log('- Code exchange:', data.success ? 'SUCCESS' : 'FAILED');
        } catch (e) {}
      }
      
      if (msg.includes('session check after auth')) {
        try {
          const data = JSON.parse(msg.split('\n')[1]);
          sessionEstablished = data.hasSession;
          console.log('- Session check:', 
            data.hasSession ? 'SUCCESS' : 'FAILED',
            data.user ? `(${data.user})` : '');
        } catch (e) {}
      }
      
      if (log.level === 'ERROR') {
        errors.push(log.message);
      }
    });
    
    console.log('\nFlow Summary:');
    console.log('- Auth code received:', hasCode ? 'Yes' : 'No');
    console.log('- Code exchange:', exchangeSuccess ? 'Success' : 'Failed');
    console.log('- Session established:', sessionEstablished ? 'Yes' : 'No');
    
    if (errors.length > 0) {
      console.log('\nErrors encountered:');
      errors.forEach(error => console.log('-', error));
    }
  });

  // Look for patterns in errors
  const errors = logs.filter(log => log.level === 'ERROR');
  if (errors.length > 0) {
    console.log('\n=== Error Patterns ===\n');
    const errorTypes = {};
    errors.forEach(error => {
      const msg = error.message.split('\n')[0];
      errorTypes[msg] = (errorTypes[msg] || 0) + 1;
    });
    
    Object.entries(errorTypes)
      .sort((a, b) => b[1] - a[1])
      .forEach(([msg, count]) => {
        console.log(`${count}x: ${msg}`);
      });
  }
}

analyzeAuthLogs();
