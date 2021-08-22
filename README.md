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

You can replace paths while run tsc in watch (`-w, --watch`) mode. Create new tsconfig.json file with different name (for now `tsconfig.watch.json`).

```json
// tsconfig.watch.json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "incremental": true,
    "tsBuildInfoFile": "./buildcache/watch.tsbuildinfo"
    // ...
  }
}
```

With [tsc-watch](https://github.com/gilamran/tsc-watch), you can use callback `--onSuccess` after transpile done. Put `tsconfig-paths-replace` script at success command.

```json
{
  "scripts": {
    "watch": "tsc-watch -p tsconfig.watch.json --noClear --noColors --onSuccess \"tsconfig-paths-replace -p ./tsconfig.watch.json",
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
  -r, --root <path>     root path of source (or `compilerOptions.rootDir`)
  -o, --out <path>      path of transpiled code output directory (or `compilerOptions.outDir`)
  -e, --emit <path>     output dir for emitted files (use `out` path by default)
  -w, --watch           watch changes of output directory
  -h, --help            display help for command
```
