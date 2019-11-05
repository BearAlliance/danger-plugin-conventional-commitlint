# danger-plugin-conventional-commitlint

[![Build Status](https://travis-ci.org/bearalliance/danger-plugin-conventional-commitlint.svg?branch=master)](https://travis-ci.org/bearalliance/danger-plugin-conventional-commitlint)
[![npm version](https://badge.fury.io/js/danger-plugin-conventional-commitlint.svg)](https://badge.fury.io/js/danger-plugin-conventional-commitlint)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

A [danger](https://github.com/danger/danger-js) plugin to lint commit messages with [commitlint](https://github.com/conventional-changelog/commitlint)

## Usage

Install:

```sh
npm install --save-dev danger-plugin-conventional-commitlint
```

At a glance:

```js
// dangerfile.js
import commitlint from 'danger-plugin-conventional-commitlint'
import rules from '@commitlint/config-conventional';

(async function dangerReport() {
  await commitlint(rules);
})();
```
> Note: you must provide your own `rules` to the function 


### Configuration

|Rule | Default | Options| Description |
| ---|---|---|---|
|`severity`|`'fail'`|`['fail', 'warn', 'message']`| danger method to call when the commit message does not pass the linter
Example config object:
```js
{
  severity: 'warn'
}
```

## Changelog

See the GitHub [release history](https://github.com/bearalliance/danger-plugin-conventional-commitlint/releases).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).
