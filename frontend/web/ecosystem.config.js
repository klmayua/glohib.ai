const fs = require('fs')
const path = require('path')

// Parse .env.production file
const envFile = path.join(__dirname, '.env.production')
const env = {}
if (fs.existsSync(envFile)) {
  fs.readFileSync(envFile, 'utf8').split('\n').forEach(line => {
    line = line.trim()
    if (!line || line.startsWith('#')) return
    const idx = line.indexOf('=')
    if (idx === -1) return
    const key = line.slice(0, idx)
    let val = line.slice(idx + 1)
    // Remove surrounding quotes
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1)
    }
    env[key] = val
  })
}

module.exports = {
  apps: [{
    name: 'glohib-ai',
    script: '.next/standalone/server.js',
    instances: 4,
    exec_mode: 'cluster',
    max_memory_restart: '500M',
    env: env,
  }]
}
