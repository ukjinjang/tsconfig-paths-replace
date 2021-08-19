# tsconfig-paths-replace

![npm](https://img.shields.io/npm/v/tsconfig-paths-replace)
[![CircleCI](https://circleci.com/gh/ukjinjang/tsconfig-paths-replace/tree/master.svg?style=shield)](https://circleci.com/gh/ukjinjang/tsconfig-paths-replace/?branch=master)
[![codecov](https://codecov.io/gh/ukjinjang/tsconfig-paths-replace/branch/master/graph/badge.svg?token=SESTVNMFAH)](https://codecov.io/gh/ukjinjang/tsconfig-paths-replace)
[![Known Vulnerabilities](https://snyk.io/test/github/ukjinjang/tsconfig-paths-replace/badge.svg)](https://snyk.io/test/github/ukjinjang/tsconfig-paths-replace)
![npm-download](https://img.shields.io/npm/dm/tsconfig-paths-replace)
![license](https://img.shields.io/npm/l/tsconfig-paths-replace)

Replace import alias paths to relative paths via tsconfig-paths.

## Installation

```bash
$ yarn add --dev tsconfig-paths-replace
```

## Getting started

#### Build and replace paths

Use `&&` operator to run replace after transpile via `tsc`.

```json
{
  "scripts": {
    "build": "tsc && tsconfig-paths-replace -s ./src"
  },
}
```

#### Watch changes

You can replace paths while run tsc as watch mode. (`-w, --watch`)

Create new tsconfig file with different name (for now `tsconfig.watch.json`), and set `outDir` as temporary dir (to prevent infinite loop on watching event).

```json
// tsconfig.watch.json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "./tmp",
    "incremental": true,
    // ...
  }
}
```

With [npm-run-all](https://www.npmjs.com/package/npm-run-all), you can run transpile and paths replacement in parallel. Make sure set `--watch` flag to both tsc and tsconfig-paths-replace. Also set different emit dir by using `--emit` option of tsconfig-paths-replace.

```json
{
  "scripts": {
    "watch": "run-p watch:tsc watch:tsconfig-path",
    "watch:tsc": "tsc -p tsconfig.watch.json -w --preserveWatchOutput",
    "watch:tsconfig-path": "tsconfig-paths-replace -p ./tsconfig.watch.json -w -s ./src -e ./dist"
  },
}
```

## Options

```txt
Usage: tsconfig-paths-replace [options]

Options:
  -V, --version         output the version number
  -p, --project <file>  path to tsconfig.json
  -c, --cwd <path>      current working directory
  -s, --src <path>      root path of source (or `compilerOptions.baseUrl`)
  -o, --out <path>      path of transpiled code output directory (or `compilerOptions.outDir`)
  -e, --emit <path>     output dir for emitted files (use `out` path by default)
  -w, --watch           watch changes of source
  -h, --help            display help for command
```
