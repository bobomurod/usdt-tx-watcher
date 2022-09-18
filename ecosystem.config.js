module.exports = {
  apps: [
    {
      name: 'usdt_watcher',
      script: 'listenToTether.js',
      watch: true,
      instances: 1,
      exec_mode: 'fork',
      cron_restart: `0 *\/90 * * *`,
      restart_delay: 60,
      log_date_format: 'YYYY-MM-DD HH:mm Z',
      out_file: '../services-usdt-logs/out.log',
      error_file: '../services-usdt-logs/error.log',
    }]
};