module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',     // New feature
        'fix',      // Bug fix
        'docs',     // Documentation
        'style',    // Formatting
        'refactor', // Refactoring
        'test',     // Testing
        'chore',    // Maintenance
        'security', // Security fix
        'perf',     // Performance
        'ci',       // CI/CD
      ],
    ],
    'scope-enum': [
      2,
      'always',
      [
        'auth',
        'api',
        'ui',
        'db',
        'infra',
        'deps',
      ],
    ],
  },
}
