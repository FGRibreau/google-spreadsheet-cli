'use strict';
const GoogleSpreadsheet = require('google-spreadsheet');
const debug = require('debug')('client');

function Client(options){
  const doc = new GoogleSpreadsheet(options.spreadsheetId);
  const credentials = require(options.credential);

  return Promise.promisify(doc.useServiceAccountAuth)(credentials)
  .then(() => Promise.promisify(doc.getInfo)())
  .tap(info => {
    debug('%s', JSON5.stringify(info));
  });
}

module.exports = Client;
