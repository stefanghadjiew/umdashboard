import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import prettier from 'eslint-plugin-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react': react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'prettier': prettier,
      'simple-import-sort': simpleImportSort
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react/jsx-no-useless-fragment': 'warn',
      'react/jsx-curly-brace-presence': ['warn', { props: 'never', children: 'never', propElementValues: 'always' }],
      'react/jsx-boolean-value': ['warn', 'never'],
      curly: ['warn', 'all'], // force curly braces around if statement
      'multiline-ternary': 'off', // conflicting
      '@typescript-eslint/no-explicit-any': 'warn', // temporary
      indent: 'off', // Prettier conflict avoidance
    'react/react-in-jsx-scope': 'off',
    'react/jsx-wrap-multilines': [
      2,
      {
        declaration: 'parens-new-line',
        assignment: 'parens-new-line',
        return: 'parens-new-line',
        arrow: 'parens-new-line',
        condition: 'parens-new-line',
        logical: 'parens-new-line',
        prop: 'ignore'
      }
    ],
    'newline-per-chained-call': 'off', // Conflict avoidance
    'prettier/prettier': [
      'error',
      {
        printWidth: 120,
        // tabWidth: 4, //provisional
        useTabs: false,
        endOfLine: 'lf',
        singleQuote: true,
        trailingComma: 'none'
      }
    ],
    'linebreak-style': ['error', 'unix'],
    'no-restricted-globals': [2, 'window'],
    'array-bracket-newline': [2, 'consistent'],
    'arrow-body-style': ['off'],
    'arrow-parens': ['off'],
    'block-scoped-var': 2,
    complexity: [1, 15],
    'consistent-return': 2,
    'consistent-this': [2, 'self'],
    'no-console': 1,
    'default-case': 2,
    'for-direction': 2,
    'func-name-matching': [
      2,
      'always',
      {
        includeCommonJSModuleExports: true
      }
    ],
    'getter-return': 2,
    'global-require': 2,
    'guard-for-in': 2,
    'jsdoc/require-jsdoc': 'off',
    'max-depth': [2, 4],
    'max-nested-callbacks': [2, 4],
    'max-len': [
      2,
      {
        code: 120,
        ignoreRegExpLiterals: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreUrls: true
      }
    ],
    'max-lines': [
      1,
      {
        max: 800,
        skipBlankLines: true,
        skipComments: true
      }
    ],
    'max-params': [2, 5],
    'max-statements': [2, 50],
    'max-statements-per-line': [
      2,
      {
        max: 1
      }
    ],
    'multiline-comment-style': [1, 'bare-block'],
    // 'newline-per-chained-call': 2, Deactivated due to conflict
    'no-alert': 1,
    'no-array-constructor': 2,
    'no-await-in-loop': 2,
    'no-buffer-constructor': 2,
    'no-catch-shadow': 2,
    'no-continue': 2,
    'no-confusing-arrow': [
      2,
      {
        allowParens: true
      }
    ],
    'no-duplicate-imports': 2,
    'no-empty-function': 2,
    'no-inner-declarations': 1,
    'no-invalid-this': 2,
    'no-label-var': 2,
    'no-lonely-if': 2,
    'no-loop-func': 2,
    'no-native-reassign': 2,
    'no-negated-condition': 2,
    'no-negated-in-lhs': 2,
    'no-nested-ternary': 0,
    'no-new-require': 2,
    'no-path-concat': 2,
    'no-reserved-keys': 0,
    'no-return-await': 2,
    'no-script-url': 2,
    'no-shadow': 0,
    'no-spaced-func': 2,
    'no-useless-concat': 2,
    'padding-line-between-statements': [
      2,
      {
        blankLine: 'never',
        prev: 'multiline-block-like',
        next: '*'
      },
      {
        blankLine: 'always',
        prev: 'class',
        next: '*'
      },
      {
        blankLine: 'always',
        prev: '*',
        next: 'class'
      },
      {
        blankLine: 'always',
        prev: 'function',
        next: '*'
      },
      {
        blankLine: 'any',
        prev: '*',
        next: 'return'
      }
    ],
    'prefer-arrow-callback': 2,
    'prefer-numeric-literals': 2,
    'prefer-rest-params': 2,
    'prefer-spread': 2,
    'prefer-template': 2,
    'object-curly-spacing': 0,
    quotes: [
      1,
      'single',
      {
        allowTemplateLiterals: true,
        avoidEscape: true
      }
    ],
    'quote-props': ['off', 'consistent'],
    radix: 2,
    'require-await': 2,
    'rest-spread-spacing': 2,
    semi: [2, 'always'],
    'semi-spacing': [
      2,
      {
        before: false,
        after: true
      }
    ],
    'semi-style': [2, 'last'],
    'sort-imports': [
      2,
      {
        ignoreCase: true,
        ignoreDeclarationSort: true
      }
    ],
    'sort-vars': 0,
    'space-before-blocks': 2,
    'space-before-function-paren': [
      2,
      {
        anonymous: 'always',
        asyncArrow: 'always',
        named: 'never'
      }
    ],
    'space-infix-ops': 2,
    'space-unary-ops': [
      2,
      {
        words: true,
        nonwords: false
      }
    ],
    'spaced-comment': 2,
    strict: [2, 'never'],
    'symbol-description': 2,
    'template-curly-spacing': 2,
    'template-tag-spacing': 2,
    'unicode-bom': 2,
    'wrap-iife': [2, 'inside'],
    'yield-star-spacing': [2, 'after'],
    yoda: 2,
    '@typescript-eslint/no-shadow': 0,
    '@typescript-eslint/no-var-requires': 0,
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          ['^\\u0000'],
          ['^\\u0000.*css', '.*[s]?css'],
          ['react'],
          ['antd', '@ant-design'],
          ['@eds'],
          ['react-hook-form'],
          ['react-router'],
          ['react-i18next'],
          ['@fortawesome'],
          ['react-oidc-context', 'oidc-client-ts'],
          ['@storybook'],
          ['@tanstack'],
          ['@testing-library'],
          ['^@?\\w'],
          ['nm.idl.*'],
          ['@api'],
          ['@components'],
          ['@constants'],
          ['@contexts'],
          ['@hooks'],
          ['@models'],
          ['@utils'],
          ['components'],
          ['constants'],
          ['contexts'],
          ['hooks'],
          ['models'],
          ['utils'],
          ['pages'],
          ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
          ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$']
        ]
      }
    ]
    },
  },
)


