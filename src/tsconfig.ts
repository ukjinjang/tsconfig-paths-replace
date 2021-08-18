import ts from 'typescript';

const DEFAULT_TSCONFIG_FILENAME = 'tsconfig.json';

/**
 * Get tsconfig.json filename.
 */
export function resolveConfigFilename(
  userFilename?: string,
  cwd = process.cwd()
) {
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
export function getTsconfigCompilerOptions(
  userFilename?: string,
  cwd = process.cwd()
) {
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
