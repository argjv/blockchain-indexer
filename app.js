const express = require('express');
const cluster = require('cluster');
const Tokenizer = require('./lib/tokenizer');
const Mapper = require('./lib/mapper');
const Store = require('./lib/inputStore');
const indexer = {
  tokenizer: Tokenizer,
  mapper: Mapper,
  store: Store
}
init(process.argv[2], process.argv[3]);
function init(type, numCPU)  {
  if (cluster.isMaster) {
    console.log(`Started with process id: ${process.pid}`);
    for (let i = 0; i < numCPU; i++)  {
      cluster.fork();
    }
    cluster.on('death', function(worker) {
      console.log(`Worker with process id ${process.pid} has died`);
    });
  } else {
    const service = new indexer[type]();
    service.start();
  }
}
