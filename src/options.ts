import { program } from 'commander';
import path from 'path';

import { getTsconfigCompilerOptions } from './tsconfig';

interface ArgvOptionValues {
  project?: string;
  cwd?: string | undefined;
  src?: string | undefined;
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

export { argv, cwd, compilerOptions };
