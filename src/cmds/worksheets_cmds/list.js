exports.command = 'list';
exports.desc = 'List spreadsheet worksheets';
exports.builder = {};
exports.handler = function (argv) {
  Client(argv).then((client) => {
    client.worksheets.forEach(ws => {
      console.log('%s - %s', ws.id, ws.title);
    });
  }, (err) => {
    throw err;
  });
};
