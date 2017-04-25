require('./bootstrap');

const {first, find}  = require('lodash/fp');

const argv = require('yargs')
.wrap(null) //  specify no column limit (no right-align)
.count('Usage:  $0 <command> [options]');

argv
  .option('spreadsheetId', {
    alias: 'id',
    describe: 'spreadsheet id, the long id in the sheets URL',
    demandOption: true
  })
  .option('credential', {
    alias: 'creds',
    describe: 'json credential path',
    demandOption: true
  })
  .demandOption(['id', 'credential'], 'Please provide spreadsheet id and credential, see: https://github.com/theoephraim/node-google-spreadsheet#authentication')

const args = argv
  .commandDir('cmds')
  .demandCommand()
  .help()
  .alias('h', 'help')
  .epilog('@FGRibreau - https://twitter.com/FGRibreau')
  .alias('v', 'verbose')
  .argv;

if(args._.length === 0){
  return argv.showHelp();
}
