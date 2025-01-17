// ecosystem.config.js
module.exports = {
    apps: [{
      name: 'crm-api',
      script: 'dist/main.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production'
      }
    }]
  };