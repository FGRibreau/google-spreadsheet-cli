exports.command = 'remove <worksheet_id>';
exports.desc = 'Remove a worksheet from the doc';

exports.builder = {};

exports.handler = function (argv) {
  // see https://github.com/theoephraim/node-google-spreadsheet/pull/109/files
  // ................ -__-
  const GOOGLE_FEED_URL = "https://spreadsheets.google.com/feeds/";
  Client(argv).then((client) => Promise.promisify(client.makeFeedRequest.bind(client))(GOOGLE_FEED_URL + "worksheets/" + argv.spreadsheetId + "/private/full/" + argv.worksheet_id, 'DELETE', {}))
  .then((isOk) => console.log(JSON.stringify({status: 'success'})));
};
