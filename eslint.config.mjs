import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import globals from 'globals';

export default [
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'dist/**',
      'build/**',
      '.serena/**',
      '.claude/**', // Claude hooks (非运行时代码)
      'scripts/generate-mental-model-templates.ts', // 废弃脚本
      'scripts/migrate-mental-model.ts', // 废弃脚本
      '*.config.js',
      '*.config.mjs',
    ],
  },
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}', '**/*.mjs'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        React: 'readonly',
        JSX: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'jsx-a11y': jsxA11yPlugin,
    },
    rules: {
      // TypeScript rules
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',

      // React rules
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/no-unescaped-entities': 'off',

      // React Hooks rules
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // Disable some rules that might conflict
      'no-unused-vars': 'off', // Use TypeScript version instead
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  {
    // Special config for scripts and config files
    files: ['scripts/**/*.{js,mjs,ts}', '*.config.{js,mjs}', '.claude/**/*.js'],
    rules: {
      'no-undef': 'off', // Node.js environment
      'no-console': 'off', // Allow console in scripts
    },
  },
];
