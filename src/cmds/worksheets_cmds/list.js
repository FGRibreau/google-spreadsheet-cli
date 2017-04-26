exports.command = 'list';
exports.desc = 'List spreadsheet worksheets';
exports.builder = {};
exports.handler = function (argv) {
  Client(argv).then((doc) =>
    Promise.promisify(doc.getInfo)().then(info => {
      debug('%s', JSON5.stringify(info));
      info.worksheets.forEach(ws => {
        console.log(JSON.stringify({id:ws.id, title:ws.title}));
      });
    })
  );
};
