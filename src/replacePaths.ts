import path from 'path';
import * as tscpath from 'tsconfig-paths';

import { argv, compilerOptions, cwd } from './options';

type PathReplaceFn = Parameters<typeof String.prototype.replace>[1];

const REGEX_REQUIRE = /(?:import|require)\(['"]([^'"]*)['"]\)/g;
const REGEX_IMPORT = /(?:import|from) ['"]([^'"]*)['"]/g;

/**
 * Resolve absolute path from aliased module filename.
 */
export function resolveAbsolutePath(moduleFilename: string) {
  return tscpath.createMatchPath(
    cwd,
    compilerOptions.paths as NonNullable<typeof compilerOptions.paths>,
    []
  )(moduleFilename);
}

/**
 * Replace import path.
 */
export function replaceImportPaths(filename: string, fileContent: string) {
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

  return fileContent
    .replace(REGEX_IMPORT, pathReplaceFn)
    .replace(REGEX_REQUIRE, pathReplaceFn);
}
