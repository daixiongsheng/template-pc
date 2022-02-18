module.exports = {
  apps: [
    {
      script: 'npm start -- --port 9000',
      name: 'server',
      cwd: '',
      env: {
        NODE_ENV: 'production',
      },
      watch: false,
      error_file: './logs/error.log',
      out_file: './logs/out.log',
      merge_logs: true,
      combine_logs: true,
      post_update: [],
      // ref: '',
      // repo: '',
      // max_memory_restart: '150M',
    },
  ],
};
