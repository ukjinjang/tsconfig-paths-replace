import path from 'path';
import * as tscpath from 'tsconfig-paths';

import { argv, compilerOptions } from './options';

type PathReplaceFn = Parameters<typeof String.prototype.replace>[1];

const REGEX_REQUIRE = /(?:import|require)\(['"]([^'"]*)['"]\)/g;
const REGEX_IMPORT = /(?:import|from) ['"]([^'"]*)['"]/g;

/**
 * Resolve absolute path from aliased module filename.
 */
export function resolveAbsolutePath(requestedModule: string) {
  return tscpath.createMatchPath(
    argv.out as string,
    compilerOptions.paths as NonNullable<typeof compilerOptions.paths>,
    []
  )(requestedModule);
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

    const moduleFilename = resolveAbsolutePath(matched);
    if (!moduleFilename) {
      return ori;
    }

    const relModuleFilename = path.relative(
      path.dirname(filename),
      moduleFilename
    );

    return ori.replace(matched, relModuleFilename);
  };

  return fileContent
    .replace(REGEX_IMPORT, pathReplaceFn)
    .replace(REGEX_REQUIRE, pathReplaceFn);
}
