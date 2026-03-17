import path from 'node:path';
import { fileURLToPath } from 'node:url';

import importPlugin from 'eslint-plugin-import';
import muiPathImportsPlugin from 'eslint-plugin-mui-path-imports';
import noRelativeImportPathsPlugin from 'eslint-plugin-no-relative-import-paths';
import prettier from 'eslint-plugin-prettier';
import reactPlugin from 'eslint-plugin-react';
import reactRefresh from 'eslint-plugin-react-refresh';
import simpleImportSortPlugin from 'eslint-plugin-simple-import-sort';
import tseslint from 'typescript-eslint';

import { fixupConfigRules, fixupPluginRules } from '@eslint/compat';
import { FlatCompat } from '@eslint/eslintrc';
import eslintJs from '@eslint/js';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const compat = new FlatCompat({
    baseDirectory: dirname,
    recommendedConfig: eslintJs.configs.recommended,
    allConfig: eslintJs.configs.all,
});

export default tseslint.config(
    {
        ignores: ['**/node_modules/', 'vite.config.ts', 'dist', '.vite'],
    },
    ...fixupConfigRules(
        compat.extends(
            'eslint:recommended',
            'plugin:import/recommended',
            'plugin:import/typescript',
            'prettier',
            'airbnb-base',
            'airbnb-typescript/base',
            'plugin:react-hooks/recommended',
        ),
    ),
    reactRefresh.configs.vite,
    {
        plugins: {
            'no-relative-import-paths': noRelativeImportPathsPlugin,
            prettier,
            import: fixupPluginRules(importPlugin),
            'simple-import-sort': simpleImportSortPlugin,
            react: reactPlugin,
            'mui-path-imports': muiPathImportsPlugin,
        },
        settings: {
            'import/resolver': {
                node: true,
                typescript: true,
            },
        },
        languageOptions: {
            ecmaVersion: 5,
            sourceType: 'script',

            parserOptions: {
                project: './tsconfig.app.json',
            },
        },
        rules: {
            'mui-path-imports/mui-path-imports': 'error',
            'no-plusplus': 'off',
            'linebreak-style': ['error', 'unix'],
            'no-nested-ternary': 'off',
            'no-confusing-arrow': 'off',
            'import/prefer-default-export': 'off',
            'prettier/prettier': [
                'error',
                {
                    singleQuote: true,
                    trailingComma: 'all',
                    printWidth: 80,
                    tabWidth: 4,
                    useTabs: false,
                    semi: true,
                    jsxSingleQuote: false,
                    bracketSpacing: true,
                    arrowParens: 'avoid',
                    importOrderSeparation: true,
                    bracketSameLine: false,
                },
            ],

            'function-paren-newline': 'off',
            'implicit-arrow-linebreak': 'off',
            'object-curly-newline': 'off',
            'operator-linebreak': 'off',
            'import/no-named-as-default-member': 'off',
            'import/no-named-as-default': 'off',
            'import/first': 'error',
            'import/consistent-type-specifier-style': [
                'error',
                'prefer-top-level',
            ],
            'import/newline-after-import': 'error',
            'import/no-duplicates': 'error',

            'import/extensions': [
                'error',
                'never',
                {
                    json: 'always',
                    svg: 'always',
                    jpg: 'always',
                    png: 'always',
                    css: 'always',
                },
            ],

            'no-relative-import-paths/no-relative-import-paths': [
                'warn',
                {
                    allowSameFolder: true,
                    rootDir: 'src',
                },
            ],

            '@typescript-eslint/consistent-type-imports': [
                'error',
                {
                    prefer: 'type-imports',
                    fixStyle: 'separate-type-imports',
                    disallowTypeAnnotations: true,
                },
            ],

            'simple-import-sort/imports': [
                'error',
                {
                    groups: [
                        ['^.*\\u0000$'],
                        ['^@server-types/'],
                        ['^node:'],
                        ['^react$'],
                        ['^react'],
                        ['^@mui'],
                        ['^\\w'],
                        ['^@/types'],
                        ['^@/hooks'],
                        ['^@/utils'],
                        ['^@/'],
                        ['^[./]'],
                    ],
                },
            ],

            'import/order': 'off',

            'simple-import-sort/exports': 'error',
            indent: 'off',
            '@typescript-eslint/indent': 'off',
            'no-console': 'off',
            'no-restricted-syntax': [
                'error',
                'ForInStatement',
                'LabeledStatement',
                'WithStatement',
            ],
            'max-len': 'off',
            'no-useless-return': 'off',

            'import/no-extraneous-dependencies': [
                'error',
                {
                    devDependencies: true,
                },
            ],

            // disable because now it is in @stylistic/eslint-plugin-ts
            '@typescript-eslint/quotes': 'off',
            '@typescript-eslint/brace-style': 'off',
            '@typescript-eslint/comma-dangle': 'off',
            '@typescript-eslint/comma-spacing': 'off',
            '@typescript-eslint/func-call-spacing': 'off',
            '@typescript-eslint/keyword-spacing': 'off',
            '@typescript-eslint/no-extra-semi': 'off',
            '@typescript-eslint/object-curly-spacing': 'off',
            '@typescript-eslint/semi': 'off',
            '@typescript-eslint/space-before-function-paren': 'off',
            '@typescript-eslint/space-before-blocks': 'off',
            '@typescript-eslint/space-infix-ops': 'off',
            '@typescript-eslint/switch-colon-spacing': 'off',
            '@typescript-eslint/type-annotation-spacing': 'off',
            '@typescript-eslint/no-throw-literal': 'off',

            '@typescript-eslint/lines-between-class-members': 'off',

            '@typescript-eslint/explicit-function-return-type': [
                'error',
                {
                    allowExpressions: true,
                    allowTypedFunctionExpressions: true,
                    allowHigherOrderFunctions: true,
                },
            ],

            'no-continue': 'off',
            'arrow-parens': ['error', 'as-needed'],

            'react/jsx-no-leaked-render': [
                'warn',
                {
                    validStrategies: ['ternary'],
                },
            ],

            'react/jsx-closing-bracket-location': ['warn', 'tag-aligned'],
            'react/jsx-closing-tag-location': ['warn', 'tag-aligned'],

            'react/jsx-curly-brace-presence': [
                'warn',
                {
                    props: 'never',
                    children: 'never',
                },
            ],

            'react/jsx-curly-newline': [
                'off',
                {
                    multiline: 'consistent',
                    singleline: 'consistent',
                },
            ],

            'react/jsx-first-prop-new-line': ['error', 'multiline'],
            'react/jsx-key': ['error'],
            'react/jsx-props-no-multi-spaces': ['warn'],

            'react/jsx-tag-spacing': [
                'warn',
                {
                    closingSlash: 'never',
                    beforeSelfClosing: 'always',
                    afterOpening: 'never',
                    beforeClosing: 'allow',
                },
            ],

            'react/jsx-wrap-multilines': [
                'warn',
                {
                    declaration: 'parens',
                    assignment: 'parens',
                    return: 'parens',
                    arrow: 'parens',
                    condition: 'ignore',
                    logical: 'ignore',
                    prop: 'ignore',
                },
            ],

            'import/no-cycle': 'off',
        },
    },
    {
        // disable type-aware linting on JS files
        files: ['**/*.{js,mjs,cjs}'],
        extends: [tseslint.configs.disableTypeChecked],
        rules: {
            'no-unused-vars': 'off',
            'import/no-dynamic-require': 'warn',
        },
    },
);
