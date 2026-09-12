import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import prettier from 'eslint-config-prettier'

export default tseslint.config(
  { ignores: ['dist', 'coverage'] },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
  {
    // Schutzregel: src/core/ kennt keine UI (CLAUDE.md).
    // Kein React, keine Imports aus features/ oder app/, weder per Alias noch relativ.
    files: ['src/core/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            { name: 'react', message: 'src/core/ ist React-frei (CLAUDE.md).' },
            { name: 'react-dom', message: 'src/core/ ist React-frei (CLAUDE.md).' },
          ],
          patterns: [
            {
              group: ['react/*', 'react-dom/*'],
              message: 'src/core/ ist React-frei (CLAUDE.md).',
            },
            {
              group: ['@/features', '@/features/*', '@/app', '@/app/*'],
              message: 'src/core/ importiert nichts aus features/ oder app/ (CLAUDE.md).',
            },
            {
              group: ['**/features', '**/features/*', '**/app', '**/app/*'],
              message:
                'Relativer Import fuehrt aus src/core/ heraus. core kennt keine UI (CLAUDE.md).',
            },
          ],
        },
      ],
    },
  },
  prettier,
)
