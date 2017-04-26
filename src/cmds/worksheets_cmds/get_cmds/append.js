const {find, keys, fromPairs, zip, flow} = require('lodash/fp');
const debug = require('debug')('append');

exports.command = 'append';
exports.desc = 'Append a row to the worksheet';

exports.builder = function(yargs) {
  return yargs.option('json', {
    alias: 'd',
    describe: 'data to add as JSON key/value, keys must match the header row on your sheet',
    demandOption: true,
    type: 'string',
    coerce: (jsonAsString) => {
      const json = JSON5.parse(jsonAsString);
      return {
        raw: json,
        keys: keys(json)
      }
    }
  });
};

function _ensureWorksheetContainsHeaderRowForData(argv) {
  return (ws) => Promise.promisify(ws.getRows)({offset: 0, limit: 1}).then((row) => {
    if(!Array.isArray(row) || row.length === 0){
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
  Client(argv).then((doc) =>
    Promise.promisify(doc.getInfo)().then(info => {
      const ws = find({
        id: argv.worksheet_id
      }, info.worksheets);
      if (!ws) {
        return Promise.reject(new Error(`Could not find worksheet '${argv.worksheet_id}'`));
      }

      return ws;
    }).then(_ensureWorksheetContainsHeaderRowForData(argv)).then(_setRow(argv.json.raw)).then(res => {
      debug('append %s', JSON5.stringify(res));
      const {content, title, updated, id} = res;
      console.log(JSON.stringify({content, title, updated, id}));
    })
  );
};
