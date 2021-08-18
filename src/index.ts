#! /usr/bin/env node

import chokidar from 'chokidar';
import { program } from 'commander';
import fs from 'fs-extra';
import globby from 'globby';
import path from 'node:path';
import * as tscpath from 'tsconfig-paths';
import ts from 'typescript';

const DEFAULT_TSCONFIG_FILENAME = 'tsconfig.json';

type PathReplaceFn = Parameters<typeof String.prototype.replace>[1];

interface ArgvOptionValues {
  project?: string;
  cwd?: string | undefined;
  src?: string | undefined;
  out?: string | undefined;
  emit?: string | undefined;
  watch?: boolean | undefined;
}

const REGEX_REQUIRE = /(?:import|require)\(['"]([^'"]*)['"]\)/g;
const REGEX_IMPORT = /(?:import|from) ['"]([^'"]*)['"]/g;

//
//
//

program
  .version('1.0.0')
  .option('-p, --project <file>', 'path to tsconfig.json')
  .option('-c, --cwd <path>', 'current working directory')
  .option(
    '-s, --src <path>',
    'root path of source (or `compilerOptions.baseUrl`)'
  )
  .option(
    '-o, --out <path>',
    'path of transpiled code output directory (or `compilerOptions.outDir`)'
  )
  .option(
    '-e, --emit <path>',
    'path of replaced results (use `out` path by default)'
  )
  .option('-w, --watch', 'watch changes of source');

program.parse(process.argv);

//
//
//

const argv = program.opts<ArgvOptionValues>();
const cwd = argv.cwd ?? process.cwd();
const compilerOptions = getTsconfigCompilerOptions(argv.project);

if (!compilerOptions.paths) {
  throw Error('"paths" not decleared at tsconfig.json');
}

argv.src = argv.src ? path.resolve(argv.src) : compilerOptions.baseUrl;
if (!argv.src) {
  throw Error(
    'Please provide root path of source via `-s` option or `baseUrl` of tsconfig.json.'
  );
}

argv.out = argv.out ? path.resolve(argv.out) : compilerOptions.outDir;
if (!argv.out) {
  throw Error(
    'Please provide root path of output via `-o` option or `outDir` of tsconfig.json.'
  );
}

argv.emit = argv.emit ? path.resolve(argv.emit) : argv.out;

//
//
//

/**
 * Get tsconfig.json filename.
 */
function resolveConfigFilename(userFilename?: string) {
  const configFilename =
    userFilename ??
    ts.findConfigFile(cwd, ts.sys.fileExists, DEFAULT_TSCONFIG_FILENAME) ??
    '';

  if (!configFilename) {
    throw Error(`Cannot find tsconfig.json file: ${configFilename}`);
  }

  return configFilename;
}

/**
 * Get compiler options of tscofig.json.
 */
function getTsconfigCompilerOptions(userFilename?: string) {
  const configFile = ts.readConfigFile(
    resolveConfigFilename(userFilename),
    ts.sys.readFile
  );

  if (!configFile.config || configFile.error) {
    throw Error(configFile.error?.messageText.toString() ?? '');
  }

  const compilerOptions = ts.parseJsonConfigFileContent(
    configFile.config,
    ts.sys,
    cwd
  );

  return compilerOptions.options;
}

/**
 * Resolve absolute path from aliased module filename.
 */
function resolveAbsolutePath(moduleFilename: string) {
  return tscpath.createMatchPath(
    cwd,
    compilerOptions.paths as NonNullable<typeof compilerOptions.paths>,
    []
  )(moduleFilename);
}

/**
 * Replace import path.
 */
function replaceImportPaths(filename: string) {
  // function for replace path
  const pathReplaceFn: PathReplaceFn = (ori, matched) => {
    if (!matched) {
      return ori;
    }

    const srcFilename = filename.replace(
      argv.out as string,
      argv.src as string
    );

    const moduleFilename = resolveAbsolutePath(matched);
    if (!moduleFilename) {
      return ori;
    }

    const relModuleFilename = path.relative(
      path.dirname(srcFilename),
      moduleFilename
    );

    return ori.replace(matched, relModuleFilename);
  };

  const content = fs.readFileSync(filename).toString();
  return content
    .replace(REGEX_IMPORT, pathReplaceFn)
    .replace(REGEX_REQUIRE, pathReplaceFn);
}

/**
 * Rewrite path.
 */
function rewriteFilePaths(filename: string, outFilename?: string) {
  if (!fs.existsSync(filename)) {
    return;
  }

  const replacedContent = replaceImportPaths(filename);

  outFilename = outFilename ?? filename;
  fs.ensureDirSync(path.dirname(outFilename));
  fs.writeFileSync(outFilename, replacedContent);
}

/**
 * Event handler for chokidar.
 */
function handleWatchEvent(rawFilename: string) {
  const filename = path.resolve(rawFilename);
  const outFilename = path.resolve(
    argv.emit as string,
    filename.replace(argv.out as string, '').replace(/^\//, '')
  );

  rewriteFilePaths(filename, outFilename);
}

//
//
//

const glob = `${argv.out}/**/*.(j|t)s`;

// watch mode
if (argv.watch) {
  chokidar
    .watch(glob, { cwd })
    .on('add', handleWatchEvent)
    .on('change', handleWatchEvent);
}

// non-watch mode
else {
  globby.sync(glob, {}).forEach(filepath => {
    rewriteFilePaths(filepath);
  });
}
