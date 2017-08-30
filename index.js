const cluster = require('cluster');
const os = require('os');

if (cluster.isMaster) {
  // use all CPUs
  const cpuCount = os.cpus().length;
  for (let i = 0; i < cpuCount; i++) cluster.fork();

  cluster.on('exit', () => cluster.fork() );
}
else {
  require('./app/server');
}
