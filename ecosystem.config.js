module.exports = {
  apps: [
    {
      name: 'glohib-ai',
      cwd: '/opt/glohib-ai/frontend/web/.next/standalone',
      script: 'node',
      args: 'server.js',
      instances: 2,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3005,
        NEXTAUTH_URL: 'https://glohibai.nyamabo.com',
        NEXT_PUBLIC_APP_URL: 'https://glohibai.nyamabo.com',
      },
      error_file: '/var/log/glohib-ai/error.log',
      out_file: '/var/log/glohib-ai/out.log',
      log_file: '/var/log/glohib-ai/combined.log',
      time: true,
      autorestart: true,
      max_memory_restart: '2G',
      watch: false,
      ignore_watch: ['node_modules', 'logs', '.next'],
      max_restarts: 5,
      min_uptime: '30s',
    },
  ],
};
