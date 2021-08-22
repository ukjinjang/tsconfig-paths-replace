import { program } from 'commander';
import path from 'path';

import { getTsconfigCompilerOptions } from './tsconfig';

interface ArgvOptionValues {
  project?: string;
  cwd?: string | undefined;
  root?: string | undefined;
  out?: string | undefined;
  emit?: string | undefined;
  watch?: boolean | undefined;
}

//
//
//

program
  .version('1.0.0')
  .option('-p, --project <file>', 'path to tsconfig.json')
  .option('-c, --cwd <path>', 'current working directory')
  .option(
    '-r, --root <path>',
    'root path of source (or `compilerOptions.rootDir`)'
  )
  .option(
    '-o, --out <path>',
    'path of transpiled code output directory (or `compilerOptions.outDir`)'
  )
  .option(
    '-e, --emit <path>',
    'output dir for emitted files (use `out` path by default)'
  )
  .option('-w, --watch', 'watch changes of output directory');

//
//
//

program.parse(process.argv);
const argv = program.opts<ArgvOptionValues>();
const cwd = argv.cwd ?? process.cwd();
const compilerOptions = getTsconfigCompilerOptions(argv.project, cwd);

if (!compilerOptions.paths) {
  throw Error('"paths" not decleared at tsconfig.json');
}

argv.root = argv.root ? path.resolve(argv.root) : compilerOptions.rootDir;
if (!argv.root) {
  throw Error(
    'Please provide root path of source via `--root` option or `rootDir` of tsconfig.json.'
  );
}

argv.out = argv.out ? path.resolve(argv.out) : compilerOptions.outDir;
if (!argv.out) {
  throw Error(
    'Please provide root path of output via `--out` option or `outDir` of tsconfig.json.'
  );
}

argv.emit = argv.emit ? path.resolve(argv.emit) : argv.out;

//
//
//

export { argv, cwd, compilerOptions };
