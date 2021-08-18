#! /usr/bin/env node

import chokidar from 'chokidar';
import fs from 'fs-extra';
import globby from 'globby';
import path from 'path';

import { argv, cwd } from './options';
import { replaceImportPaths } from './replacePaths';

/**
 *
 */
function getOutFilename(filename: string) {
  return path.resolve(
    argv.emit as string,
    filename.replace(argv.out as string, '').replace(/^\//, '')
  );
}

/**
 * Rewrite path.
 */
function rewriteFilePaths(filename: string, outFilename?: string) {
  if (!fs.existsSync(filename)) {
    return;
  }

  const fileContent = fs.readFileSync(filename).toString();
  const replacedContent = replaceImportPaths(filename, fileContent);

  outFilename = outFilename ?? filename;
  fs.ensureDirSync(path.dirname(outFilename));
  fs.writeFileSync(outFilename, replacedContent);
}

/**
 * Event handler for chokidar.
 */
function handleWatchEvent(rawFilename: string) {
  const filename = path.resolve(rawFilename);
  const outFilename = getOutFilename(rawFilename);
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
  globby.sync(glob, {}).forEach(filename => {
    const outFilename = getOutFilename(filename);
    rewriteFilePaths(filename, outFilename);
  });
}
