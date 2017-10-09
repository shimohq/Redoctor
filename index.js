var Redis = require('ioredis')
var program = require('commander')
var package = require('./package.json')
var tasks = require('./tasks')

program
  .version(package.version)
  .option('-p, --port [port]', 'redis port')
  .option('-h, --host [host]', 'redis host')
  .option('-a, --auth [auth]', 'redis password')
  .option('--scan-pattern [pattern]', 'filter keys by pattern')
  .option('--strip-pattern [pattern]', 'strip key name by pattern')
  .option('-c, --count [count]', 'scan count per time, default: 100', '100')
  .option('-t, --task [task]', 'task [memory]', 'memory')
  .option('--aliyun', 'Aliyun redis cluster compatible mode')
  .parse(process.argv);

var task = tasks[program.task]

if (!task) {
  throw new Error('No supported tasks: ' + program.task)
}

var redis = new Redis({
  port: program.port && Number(program.port),
  host: program.host,
  password: program.auth
})

task(redis, program)
