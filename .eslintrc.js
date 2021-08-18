module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'prettier',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:prettier/recommended',
  ],
  plugins: ['@typescript-eslint', 'simple-import-sort'],
  parserOptions: {
    project: ['tsconfig.eslint.json'],
    tsconfigRootDir: __dirname,
    sourceType: 'module',
    ecmaVersion: 2020,
  },
  env: {
    browser: true,
  },
  rules: {
    // === plugin:@typescript-eslint/recommended ===
    // === ref: https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin ===
    '@typescript-eslint/adjacent-overload-signatures': 'warn',
    '@typescript-eslint/array-type': 'warn',
    '@typescript-eslint/brace-style': 'off',
    '@typescript-eslint/camelcase': 'off',
    '@typescript-eslint/consistent-type-imports': 'error',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-inferrable-types': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/no-unsafe-return': 'off',
    '@typescript-eslint/no-unused-expressions': 'error',
    '@typescript-eslint/require-await': 'off',
    '@typescript-eslint/restrict-template-expressions': 'off',
    '@typescript-eslint/unbound-method': 'off',

    // === plugin:simple-import-sort ===
    // === ref: https://github.com/lydell/eslint-plugin-simple-import-sort ===
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          // Packages. `react` related packages come first.
          ['^react', '^@?\\w'],
          // Side effect imports.
          ['^\\u0000'],
          // Other relative imports. Put same-folder imports and `.` last.
          [
            '^src/',
            '^\\.\\.(?!/?$)',
            '^\\.\\./?$',
            '^\\./(?=.*/)(?!/?$)',
            '^\\.(?!/?$)',
            '^\\./?$',
          ],
          // `@elice/material` related imports.
          ['^.+\\.styled$', '^.+\\.i18n$'],
          // Type imports.
          ['^@?\\w.*\\u0000$', '^[^.].*\\u0000$', '^\\..*\\u0000$'],
          // Style imports.
          ['^.+\\.s?css$'],
          // Image imports.
          ['^.+\\.(png|jpg|jpeg|gif|svg)$'],
        ],
      },
    ],

    // === eslint ===
    'brace-style': 'off',
    'camelcase': 'off',
    'comma-dangle': 'off',
    'import/no-anonymous-default-export': 'off',
    'no-console': ['warn', { allow: ['debug', 'warn', 'error'] }],
    'no-multiple-empty-lines': 'off',
    'no-unused-expressions': 'off',
    'no-use-before-define': 'off',
  },
  overrides: [
    {
      files: ['*.test.ts'],
      extends: ['plugin:jest/all'],
      plugins: ['jest'],
      env: {
        'jest/globals': true,
      },
      rules: {
        'jest/no-conditional-expect': 'off',
        'jest/no-hooks': ['error', { allow: ['beforeEach'] }],
        'jest/prefer-called-with': 'off',
        'jest/valid-expect-in-promise': 'off',
      },
    },
  ],
};
