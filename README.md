# danger-plugin-conventional-commitlint

[![CI](https://github.com/BearAlliance/danger-plugin-conventional-commitlint/actions/workflows/ci.yml/badge.svg)](https://github.com/BearAlliance/danger-plugin-conventional-commitlint/actions/workflows/ci.yml)
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
import commitlint from 'danger-plugin-conventional-commitlint';
import configConventional from '@commitlint/config-conventional';

(async function dangerReport() {
  const commitlintConfig = {
    severity: 'warn',
  };
  await commitlint(configConventional.rules, commitlintConfig);
})();
```

> Note: you must provide your own `rules` to the function

## API

commitlint([rules], [options])

### Options

#### `severity`

Type: `String`<br>
Choices: `'fail' | 'warn' | 'message'`<br>
Default: `'fail'`<br>
Danger method to call when the commit message does not pass the linter

---

#### `messageReplacer`

Type:

```ts
(ruleOutcome: LintOutcome, commitMessage: string) => string;
```

Default:

```
There is a problem with the commit message > [Commit message] - [Error Messages]
```

Method to add a custom message. When not passed, a default message is shown.
Example:

```ts
const messageReplacer = (
  ruleOutcome: LintOutcome,
  commitMessage: string
): string => {
  const errorsDescription = ruleOutcome.errors
    .map((error) => `<li>${error.message}</li>`)
    .join('');

  return `<p>Commit message: <b>"${commitMessage}"</b></p><ul>${errorsDescription}</ul> Suffix after commit message`;
};
```

## Changelog

See the GitHub [release history](https://github.com/bearalliance/danger-plugin-conventional-commitlint/releases).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).
