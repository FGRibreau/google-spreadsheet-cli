'use strict';
require('./bootstrap');

const execa = require('execa');
const p = require('path');
const {flow, split, first, trim} = require('lodash/fp');
const t = require('chai').assert;

const BIN = p.resolve(__dirname, '../bin/google-spreadsheet-cli');

const TEST_SPREADSHEET_ID = process.env.TEST_SPREADSHEET_ID;
const TEST_CREDENTIALS = process.env.TEST_CREDENTIALS;

t.ok(TEST_SPREADSHEET_ID.length > 0);
t.ok(TEST_CREDENTIALS.length > 0);

const BASE_PARAMS = ['--spreadsheetId', TEST_SPREADSHEET_ID, '--credentials', TEST_CREDENTIALS];

describe('--help', () => {
  it('display help', () => {
    return execa(BIN, BASE_PARAMS.concat([])).then(result => {
      t.ok(false, 'should not be called');
    }, (err) => t.include(err.message, '@FGRibreau'));
  });
});

describe('worksheets', () => {
  // helpers
  function removeAllButOneWorksheets() {
    function tryToRemove() {
      return execa(BIN, BASE_PARAMS.concat(['worksheets', 'remove', '1']));
    }

    return tryToRemove().then(removeAllButOneWorksheets, (err) => Promise.resolve());
  }

  const list = (f = (a) => a) => execa(BIN, BASE_PARAMS.concat(['worksheets', 'list'])).then(f);
  const add = (args, f) => execa(BIN, BASE_PARAMS.concat(['worksheets', 'add'].concat(args))).then(f);
  const remove = (worksheetId) => execa(BIN, BASE_PARAMS.concat(['worksheets', 'remove', worksheetId]));

  const assertListInclude = (output) => list(result => t.include(result.stdout, output));
  const assertListNotInclude = (output) => list(result => t.notInclude(result.stdout, output));

  beforeEach(removeAllButOneWorksheets);

  describe('add', () => {
    it('adds a worksheet', () => {
      const NAME = `NAME_${ + new Date()}`;
      const ROW_COUNT = 150;
      const COL_COUNT = 149;
      return add([
        NAME,
        '--rowCount',
        ROW_COUNT,
        ,
        '--colCount',
        COL_COUNT
      ]).then(result => {
        const {id, title, rowCount, colCount} = parse(result.stdout);
        t.strictEqual(title, NAME);
        t.strictEqual(rowCount, ROW_COUNT);
        t.strictEqual(colCount, COL_COUNT);
        return assertListInclude(`${id}`);
        return assertListInclude(`${name}`);
      })
    });
  });

  describe('remove', () => {
    it('remove a worksheet', () => {
      const NAME = `NAME_${ + new Date()}`;
      return add([NAME]).then(() => add([NAME + '_'])).then(result => {
        const {id} = JSON.parse(result.stdout);
        return assertListInclude(id).then(() => id);
      }).then((id) => remove(id).then((res) => id)).then((id) => assertListNotInclude(id))
    });
  });

  describe('get', () => {
    describe('append', () => {
      it('add a row into the worksheet using raw JSON', () => {
        return list().then(res => {
          const {id} = parse(res.stdout);
          return execa(BIN, BASE_PARAMS.concat([
            'worksheets',
            'get',
            '--wsId',
            id,
            'append',
            '--json',
            JSON.stringify({a: 1, b: 2, c: 3})
          ])).then(result => {
            t.strictEqual(JSON.parse(result.stdout).content, `b: 2, c: 3`);
          });
        });
      });

      it('add a row into the worksheet using raw JSON5', () => {
        return list().then(res => {
          const {id} = parse(res.stdout);
          return execa(BIN, BASE_PARAMS.concat([
            'worksheets',
            'get',
            '--wsId',
            id,
            'append',
            '--json',
            JSON5.stringify({a: 1, b: 2, c: 3})
          ])).then(result => {
            t.strictEqual(JSON.parse(result.stdout).content, `b: 2, c: 3`);
          });
        });
      });

      it('add a row into the worksheet using base64 encoded JSON', () => {
        return list().then(res => {
          const {id} = parse(res.stdout);
          return execa(BIN, BASE_PARAMS.concat([
            'worksheets',
            'get',
            '--wsId',
            id,
            'append',
            '--json',
            btoa(JSON5.stringify({a: 1, b: 2, c: 3}))
          ])).then(result => {
            t.strictEqual(JSON.parse(result.stdout).content, `b: 2, c: 3`);
          });
        });
      });
    });
  });
});

function parse(str) {
  try {
    return JSON.parse(str);
  } catch (err) {
    console.error(err);
    console.error(str);
    throw err;
  }
}

function btoa(str) {
  return new Buffer(str.toString(), 'binary').toString('base64');
}
