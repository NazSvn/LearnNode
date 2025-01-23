import globals from 'globals'
import pluginJs from '@eslint/js'

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    rules: {
      // Warns about multiple empty lines
      'no-multiple-empty-lines': ['warn', { max: 1 }],

      // Warns about trailing spaces at end of lines
      'no-trailing-spaces': 'warn',

      // Warns about extra semicolons
      'no-extra-semi': 'warn',

      // Warns about trailing commas in multiline objects/arrays
      'comma-dangle': ['warn', 'never'],

      // Controls spacing around commas
      'comma-spacing': ['warn', { before: false, after: true }],

      'capitalized-comments': ['warn', 'always']
    }
  },
  pluginJs.configs.recommended
]
