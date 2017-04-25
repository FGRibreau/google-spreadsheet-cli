exports.command = 'get';
exports.desc = 'Get a worksheet';

exports.builder = function (yargs) {
  return yargs
    .option('worksheet_id', {
      alias: 'wsId',
      describe: 'worksheet id, use `worksheets list` to list spreadsheet worksheet ids.',
      demandOption: true
    })
    .commandDir('get_cmds')
    .demandCommand();
};
