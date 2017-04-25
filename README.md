### 📊 Google Spreadsheet CLI

![deps](https://img.shields.io/david/fgribreau/google-spreadsheet-cli.svg?style=flat) ![Version](https://img.shields.io/npm/v/google-spreadsheet-cli.svg?style=flat) [![Docker hub](https://img.shields.io/docker/pulls/fgribreau/google-spreadsheet-cli.svg)](https://hub.docker.com/r/fgribreau/google-spreadsheet-cli/) [![available-for-advisory](https://img.shields.io/badge/available%20for%20consulting%20advisory-yes-ff69b4.svg?)](http://bit.ly/2c7uFJq) ![extra](https://img.shields.io/badge/actively%20maintained-yes-ff69b4.svg) [![Twitter Follow](https://img.shields.io/twitter/follow/fgribreau.svg?style=flat)](https://twitter.com/FGRibreau)


## ❤️ Shameless plug

- [**Charts, simple as a URL**. No more server-side rendering pain, 1 url = 1 chart](https://image-charts.com)
- [Looking for a free **Redis GUI**?](http://redsmin.com) [Or for **real-time alerting** & monitoring for Redis?](http://redsmin.com)

<!-- <p align="center"><img src="" alt="mixpanel cli" title="mixpanel cli"></p> -->

## 📢 Features

- List worksheets
- Append a row to a worksheet
- Automatically adds the header row if it's missing
- Permissive JSON format through [JSON5](http://json5.org/)


## Currently supported

```bash
$ google-spreadsheet-cli

Commands:
  worksheets <command>  Worksheets related commands

Options:
  --spreadsheetId, --id  spreadsheet id, the long id in the sheets URL  [required]
  --credential, --creds  json credential path  [required]
  -h, --help             Show help  [boolean]

@FGRibreau - https://twitter.com/FGRibreau
```


## 🎩 Usage

First thing first, you need your Google credentials, [follow the authentication instructions there](https://github.com/theoephraim/node-google-spreadsheet#service-account-recommended-method). Then save the JSON file somewhere, e.g. `~/myproject-8cbb20000000.json`.

Locate the spreadsheet you want to work with, take the id from Google spreadsheet URL, e.g. `2CVmfghQmkMdLct11Tfo0aqv1WtnPA-chuYDUMEvoVPw`.

Then list your document worksheet:

```bash
google-spreadsheet-cli \
  --id 2CVmfghQmkMdLct11Tfo0aqv1WtnPA-chuYDUMEvoVPw \
  --credential ~/myproject-8cbb20000000.json \
  worksheets list

od6 - my first worksheet
od7 - my second worksheet
ad7 - oh oh oh the last one
```

Once you got the worksheet id it's really simple to append a row:

```
google-spreadsheet-cli \
  --id 2CVmfghQmkMdLct11Tfo0aqv1WtnPA-chuYDUMEvoVPw \
  --credential ~/myproject-8cbb20000000.json \
  worksheets \
  get --worksheet_id od6 \
  append --json '{a:1, b:2, c:3}'

Row added.
```

Note that the JSON data we passed was not strictly valid still it worked thanks to JSON5.

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
google-spreadsheet-cli --token=XXX append VAL1 VAL2 VAL3

# done!
```

## Setup (NodeJS)

```
npm i google-spreadsheet-cli -g
```


## 🔫 Todo

- [ ] Integration tests


## [Changelog](/CHANGELOG.md)
