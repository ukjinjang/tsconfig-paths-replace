# tsconfig-paths-replace

Replace import paths via tsconfig-paths.

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

You can use 

```json
{
  "scripts": {
    "watch": "run-p watch-tsc watch-tsconfig-path",
    "watch-tsc": "tsc -w --preserveWatchOutput",
    "watch-tsconfig-path": "tsc -w --preserveWatchOutput"
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
  -w, --watch           watch changes of source
  -h, --help            display help for command
```
