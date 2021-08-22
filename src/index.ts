#! /usr/bin/env node

import chokidar from 'chokidar';
import fs from 'fs';
import globby from 'globby';
import path from 'path';

import { argv, cwd } from './options';
import { replaceImportPaths } from './replacePaths';

/**
 * Get filename to emit.
 */
function getEmitFilename(filename: string) {
  const resolvedFilename = path.resolve(filename);

  return path.resolve(
    argv.emit as string,
    resolvedFilename.replace(argv.out as string, '').replace(/^\//, '')
  );
}

/**
 * Rewrite path.
 */
function rewriteFilePaths(filename: string) {
  if (!fs.existsSync(filename)) {
    return;
  }

  const content = fs.readFileSync(filename).toString();
  const replacedContent = replaceImportPaths(filename, content);

  const emitFilename = getEmitFilename(filename);
  fs.mkdirSync(path.dirname(emitFilename), { recursive: true });
  fs.writeFileSync(emitFilename, replacedContent);
}

//
//
//

const glob = `${argv.out}/**/*.(j|t)s`;

// watch mode
if (argv.watch) {
  chokidar
    .watch(glob, { cwd })
    .on('add', rewriteFilePaths)
    .on('change', rewriteFilePaths);
}

// non-watch mode
else {
  globby.sync(glob, { cwd }).forEach(rewriteFilePaths);
}
