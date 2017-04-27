'use strict';

const {find, keys, fromPairs, zip, flow, isPlainObject} = require('lodash/fp');
const debug = require('debug')('append');
const isBase64 = require('is-base64');

exports.command = 'append';
exports.desc = 'Append a row to the worksheet';

exports.builder = function(yargs) {
  return yargs.option('json', {
    alias: 'd',
    describe: 'data to add as JSON key/value, keys must match the header row on your sheet. JSON can be base64 encoded and is JSON5 compatible.',
    demandOption: true,
    type: 'string',
    coerce: (jsonAsString) => {
      debug('got jsonAsString=%s', jsonAsString);

      // if it's base64 encoded first decode it
      const decodedAsString = isBase64(jsonAsString) ? atob(jsonAsString) : jsonAsString;
      debug('got decodedAsString=%s', decodedAsString);

      // parse it using JSON5
      const json = tryOrElse(() => JSON5.parse(decodedAsString), false);

      debug('got json=%s', JSON.stringify(json));

      if (!isPlainObject(json)) {
        throw new Error(`data must be JSON: ${decodedAsString}`)
      }

      return {raw: json, keys: keys(json)}
    }
  });
};

function _ensureWorksheetContainsHeaderRowForData(argv) {
  return (ws) => Promise.promisify(ws.getRows)({offset: 0, limit: 1}).then((row) => {
    if (!Array.isArray(row) || row.length === 0) {
      // add the first row
      debug('header row not found');
      debug('setting header row %s', argv.json.keys);
      return _setRow(argv.json.keys, 'setHeaderRow')(ws).then(() => ws);
    }

    return ws;
  });
}

function _setRow(value, method = 'addRow') {
  return (ws) => Promise.promisify(ws[method])(value);
}

exports.handler = function(argv) {
  Client(argv).then((doc) => Promise.promisify(doc.getInfo)().then(info => {
    const ws = find({
      id: argv.worksheetId
    }, info.worksheets);
    if (!ws) {
      return Promise.reject(new Error(`Could not find worksheet '${argv.worksheetId}'`));
    }

    return ws;
  }).then(_ensureWorksheetContainsHeaderRowForData(argv)).then(_setRow(argv.json.raw)).then(res => {
    debug('append %s', JSON5.stringify(res));
    const {content, title, updated, id} = res;
    console.log(JSON.stringify({content, title, updated, id}));
  }));
};

function atob(str) {
  return new Buffer(str.toString(), 'base64').toString('utf8');
}


function tryOrElse(f, defVal){
  try{
    return f();
  }catch(err){
    console.error(err);
  }
  return defVal;
}
