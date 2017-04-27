require('./bootstrap');

const {first, find}  = require('lodash/fp');

const argv = require('yargs')
.wrap(null) //  specify no column limit (no right-align)
.count('Usage:  $0 <command> [options]');

argv
  .env('MY_PROGRAM')
  .option('spreadsheetId', {
    alias: 'id',
    describe: 'spreadsheet id, the long id in the sheets URL',
    demandOption: true
  })
  .option('credentials', {
    alias: 'creds',
    describe: 'json credential path or JSON stringified credential in base64. See https://github.com/theoephraim/node-google-spreadsheet#authentication',
    demandOption: true,
    coerce: (jsonAsStringOrPath) => {
      try{
        // KISS
        return JSON5.parse(atob(jsonAsStringOrPath));
      }catch(err){}

      try{
        return require(jsonAsStringOrPath);
      }catch(err){}
    }
  });

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


function atob(str) {
  return new Buffer(str, 'base64').toString('binary');
}
