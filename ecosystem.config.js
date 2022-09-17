module.exports = {
  apps: [
    {
      name: 'Tether txs watcher',
      script: 'listenToTether.js',
      watch: true,
      instances: 1,
      exec_mode: 'fork',
      restart_delay: 14000,
      cron_restart: "0 */90 * * *",
      log_date_format: 'YYYY-MM-DD HH:mm Z',
      out_file: '../services-usdt-logs/out.log',
      error_file: '../services-usdt-logs/error.log',
    }]
};