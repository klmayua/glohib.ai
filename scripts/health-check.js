// Health check script for PM2 monitoring
const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/auth/me',
  method: 'GET',
  timeout: 5000,
};

const req = http.request(options, (res) => {
  // Any response is fine (even 401 for unauthenticated)
  console.log(`Health check passed: ${res.statusCode}`);
  process.exit(0);
});

req.on('error', (error) => {
  console.error(`Health check failed: ${error.message}`);
  process.exit(1);
});

req.on('timeout', () => {
  console.error('Health check timed out');
  req.destroy();
  process.exit(1);
});

req.end();
