'use strict';
const bench = require('fastbench'),
  pino = require('pino'),
  { createLogger } = require('./loggers'),
  nullLogger = createLogger({ options: pino.destination('/dev/null'), loggerOption: 'pino' }),
  { type, platform, arch, release, cpus } = require('os');

const stringExample = 'This is a string',
  objectExample = { foo: 'bar', foo1: 'bar', foo2: 'bar', foo3: 'bar' },
  deepObjExample = { ...require('../package.json'), level: 'info' },
  longStringExample = JSON.stringify(require('../package.json')),
  longDeepObjExample = { ...require('../package-lock.json'), level: 'info' },
  reallyLongStringExample = JSON.stringify(require('../package-lock.json'));

let iterations = 10;
if (process.argv[2] && !isNaN(process.argv[2])) {
  iterations = process.argv[2];
}

const times = 10;
console.log(`Wolox logger benchmarks
-------------------------------------------------------------
To set the iterations number (default is 10) add a number argument to this bench call.
Benchs:
- simpleString is '${stringExample}'
- simpleObject is ${JSON.stringify(objectExample)}
- longString is the file package.json stringified
- deepObject is the file package.json
- reallyLongString is the file package-lock.json stringified
- longDeepObject is the file package-lock.json
-------------------------------------------------------------
Run at: ${type()}/${platform()} ${arch()} ${release()} ~ ${cpus()[0].model} (cores/threads: ${cpus().length})
10 logs, iterated ${iterations} times. Benched 2 times:`);
const run = bench(
  [
    function simpleString(done) {
      for (let i = 0; i < times; i++) {
        nullLogger.info(stringExample);
      }
      setImmediate(done);
    },
    function simpleObject(done) {
      for (let i = 0; i < times; i++) {
        nullLogger.info(objectExample);
      }
      setImmediate(done);
    },
    function longString(done) {
      for (let i = 0; i < times; i++) {
        nullLogger.info(longStringExample);
      }
      setImmediate(done);
    },
    function deepObject(done) {
      for (let i = 0; i < times; i++) {
        nullLogger.info(deepObjExample);
      }
      setImmediate(done);
    },
    function reallyLongString(done) {
      for (let i = 0; i < times; i++) {
        nullLogger.info(reallyLongStringExample);
      }
      setImmediate(done);
    },
    function longDeepObj(done) {
      for (let i = 0; i < times; i++) {
        nullLogger.info(longDeepObjExample);
      }
      setImmediate(done);
    }
  ],
  iterations
);

// run them two times
run(run);
