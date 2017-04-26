'use strict';
const assert = require('assert');
const GoogleSpreadsheet = require('google-spreadsheet');
const debug = require('debug')('client');

function Client(options){
  assert(options.spreadsheetId);
  assert(options.credentials);
  const doc = new GoogleSpreadsheet(options.spreadsheetId);

  return Promise.promisify(doc.useServiceAccountAuth)(options.credentials).then(() => doc)
}

module.exports = Client;
