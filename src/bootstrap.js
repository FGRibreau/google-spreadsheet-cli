// useful tools
global.Promise = require('bluebird');
global.JSON5 = require('json5');
global.package = require('../package.json');
global.debug = require('debug')(package.name);

//
global.Client = require('./Client');

process.on("unhandledRejection", function(reason, promise) {
  console.error(reason);
  process.exit(1);
});
