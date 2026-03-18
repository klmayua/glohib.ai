# =============================================================================
# GLOHIB.AI - PM2 ECOSYSTEM CONFIGURATION
# Production deployment for Next.js frontend
# =============================================================================

module.exports = {
  apps: [
    {
      name: 'glohib-ai',
      cwd: '/opt/glohib-ai',
      script: 'npm',
      args: 'start',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      error_file: '/var/log/glohib-ai/error.log',
      out_file: '/var/log/glohib-ai/out.log',
      log_file: '/var/log/glohib-ai/combined.log',
      time: true,
      autorestart: true,
      max_memory_restart: '1G',
      watch: false,
      ignore_watch: ['node_modules', 'logs', '.next'],
      max_restarts: 10,
      min_uptime: '10s',
    },
    {
      name: 'glohib-ai-monitor',
      cwd: '/opt/glohib-ai',
      script: 'scripts/health-check.js',
      interval: '30s',
      error_file: '/var/log/glohib-ai/monitor-error.log',
      out_file: '/var/log/glohib-ai/monitor-out.log',
      time: true,
      autorestart: false,
    },
  ],
};
