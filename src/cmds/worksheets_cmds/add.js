exports.command = 'add <title>';
exports.desc = 'Add a new worksheet to the doc';
exports.builder = function (yargs) {
  return yargs
    .option('rowCount', {
      alias: 'row',
      describe: 'number of rows',
      default: 50
    })
    .option('colCount', {
      alias: 'col',
      describe: 'number of columns',
      default: 20
    })
};


exports.handler = function (argv) {
  Client(argv).then((client) => Promise.promisify(client.addWorksheet.bind(client))({
    title:argv.title,
    colCount:argv.colCount,
    rowCount:argv.rowCount
  })).then(({id, title, rowCount, colCount, url}) => console.log(JSON.stringify({id, title, rowCount, colCount, url})));
};
