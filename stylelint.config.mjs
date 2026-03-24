/** @type {import('stylelint').Config} */
export default {
  extends: ['stylelint-config-standard'],
  ignoreFiles: ['dist/**', 'node_modules/**'],
  rules: {
    // Tailwind v4 使用 @import 'tailwindcss'，非 url() 形式
    'import-notation': null,
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'tailwind',
          'apply',
          'layer',
          'config',
          'theme',
          'utility',
          'plugin',
          'source',
          'custom-variant',
        ],
      },
    ],
  },
}
