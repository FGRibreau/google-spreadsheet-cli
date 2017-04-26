### 📊 Google Spreadsheet CLI

[![Build Status](https://img.shields.io/circleci/project/FGRibreau/google-spreadsheet-cli.svg)](https://circleci.com/gh/FGRibreau/google-spreadsheet-cli/)
[![Coverage Status](https://img.shields.io/coveralls/FGRibreau/google-spreadsheet-cli/master.svg)](https://coveralls.io/github/FGRibreau/google-spreadsheet-cli?branch=master)
![deps](https://img.shields.io/david/fgribreau/google-spreadsheet-cli.svg?style=flat) ![Version](https://img.shields.io/npm/v/google-spreadsheet-cli.svg?style=flat) [![Docker hub](https://img.shields.io/docker/pulls/fgribreau/google-spreadsheet-cli.svg)](https://hub.docker.com/r/fgribreau/google-spreadsheet-cli/) [![available-for-advisory](https://img.shields.io/badge/available%20for%20consulting%20advisory-yes-ff69b4.svg?)](http://bit.ly/2c7uFJq) ![extra](https://img.shields.io/badge/actively%20maintained-yes-ff69b4.svg) [![Twitter Follow](https://img.shields.io/twitter/follow/fgribreau.svg?style=flat)](https://twitter.com/FGRibreau)


## ❤️ Shameless plug

- [**Charts, simple as a URL**. No more server-side rendering pain, 1 url = 1 chart](https://image-charts.com)
- [Looking for a free **Redis GUI**?](http://redsmin.com) [Or for **real-time alerting** & monitoring for Redis?](http://redsmin.com)

<!-- <p align="center"><img src="" alt="mixpanel cli" title="mixpanel cli"></p> -->

## 📢 Features

- List worksheets
- Add worksheet
- Remove worksheet
- Append a row to a worksheet
- Automatically adds the header row if it's missing
- Permissive JSON format through [JSON5](http://json5.org/)

### 🎩 Authentication

First thing first, you need your Google credentials, [follow the authentication instructions there](https://github.com/theoephraim/node-google-spreadsheet#service-account-recommended-method). Then save the JSON file somewhere, e.g. `~/myproject-8cbb20000000.json`.

Locate the spreadsheet you want to work with, take the id from Google spreadsheet URL, e.g. `2CVmfghQmkMdLct11Tfo0aqv1WtnPA-chuYDUMEvoVPw`.

If you wish to directly pass the base64 stringified JSON as `--credential` parameter you might first want to only keep `client_email` and `private_key` using [jq.node](https://github.com/FGRibreau/jq.node) like so:

```bash
export CREDENTIALS=$(cat ~/myproject-8cbb20000000.json | jq -r btoa 'pick(["client_email", "private_key"]) | JSON.stringify | btoa')
```

### `worksheets list`

List spreadsheet document worksheets:

```bash
google-spreadsheet-cli \
  --id 2CVmfghQmkMdLct11Tfo0aqv1WtnPA-chuYDUMEvoVPw \
  --credentials ~/myproject-8cbb20000000.json \
  worksheets list

  {"id":"od6","title":"my first worksheet"}
  {"id":"od7","title":"my second worksheet"}
  {"id":"ad7","title":"oh oh oh the last one"}
```

... or you could also pass the credential as a base64 encoded JSON:

```bash
google-spreadsheet-cli \
  --id 2CVmfghQmkMdLct11Tfo0aqv1WtnPA-chuYDUMEvoVPw \
  --credentials $CREDENTIALS \
  worksheets list

{"id":"od6","title":"my first worksheet"}
{"id":"od7","title":"my second worksheet"}
{"id":"ad7","title":"oh oh oh the last one"}
```

### `worksheets get --worksheet_id {worksheet_id} append --json`

Append a row to a worksheet. Once you got the `worksheet_id` it's really simple to append a row:

```bash
$ google-spreadsheet-cli \
  --id 2CVmfghQmkMdLct11Tfo0aqv1WtnPA-chuYDUMEvoVPw \
  --credentials $CREDENTIALS \
  worksheets \
  get --worksheet_id od6 \
  append --json '{a:1, b:2, c:3}'

{"content":"b: 2, c: 3","title":"1","updated":"2017-04-26T21:46:22.201Z","id":"https://spreadsheets.google.com/feeds/list/2CVmfghQmkMdLct11Tfo0aqv1WtnPA-chuYDUMEvoVPw/od6/cpzh4"}
```

Note that the JSON data we passed was not strictly valid still it worked thanks to JSON5.

### `worksheets add <title>`

Add a worksheet to the spreadsheet document:

```bash
$ google-spreadsheet-cli \
  --id 2CVmfghQmkMdLct11Tfo0aqv1WtnPA-chuYDUMEvoVPw \
  --credentials $CREDENTIALS \
  worksheets \
  add my_awesome_worksheet

{"id":"oy7n5ch","title":"my_awesome_worksheet","rowCount":50,"colCount":20,"url":"https://spreadsheets.google.com/feeds/worksheets/2CVmfghQmkMdLct11Tfo0aqv1WtnPA-chuYDUMEvoVPw/oy7n5ch"}
```

Other options:

```bash
  --spreadsheetId, --id   spreadsheet id, the long id in the sheets URL  [required]
  --credentials, --creds  json credential path (use environment variable to specify a JSON stringified credential in base64)  [required]
  --rowCount, --row       number of rows  [default: 50]
  --colCount, --col       number of columns  [default: 20]
  -h, --help              Show help  [boolean]
```

### `worksheets remove <worksheet_id>`

Remove a worksheet from the spreadsheet document:

```bash
$ google-spreadsheet-cli \
  --id 2CVmfghQmkMdLct11Tfo0aqv1WtnPA-chuYDUMEvoVPw \
  --credentials $CREDENTIALS \
  worksheets \
  remove od6

{"status": "success"}
```

## Setup (docker 🐳)

Use this approach if you don't know/want to setup your NodeJS environment, that's what containers are good for.

```shell
# open ~/.bashrc  (or equivalent)
nano ~/.bashrc

# edit it
function google-spreadsheet-cli(){
 docker run -i --rm fgribreau/google-spreadsheet-cli:latest $@
}

# save it

# source it
source ~/.bashrc

# run it!
google-spreadsheet-cli \
  --id 2CVmfghQmkMdLct11Tfo0aqv1WtnPA-chuYDUMEvoVPw \
  --credentials $CREDENTIALS \
  worksheets \
  get --worksheet_id od6 \
  append --json '{a:1, b:2, c:3}'

# done!
```

## Setup (NodeJS)

```
npm i google-spreadsheet-cli -g
```

## [Changelog](/CHANGELOG.md)
