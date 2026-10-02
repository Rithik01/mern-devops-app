import js from '@eslint/js';
import globals from 'globals';

export default [
  { ignores: ['node_modules/', 'coverage/'] },
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.node,
    },
    rules: {
      // Allow unused args that start with "_" (e.g. Express's `next`)
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
];
