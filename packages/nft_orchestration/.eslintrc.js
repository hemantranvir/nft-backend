module.exports = {
  extends: [
    'airbnb-base',
    'plugin:prettier/recommended',
    'plugin:import/recommended',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [],
  rules: {
    'import/prefer-default-export': 0,
    camelcase: 'off',
    'no-plusplus': 'off',
    'no-use-before-define': 'off',
    'no-underscore-dangle': 'off',
    'no-console': 'warn',
    'no-shadow': 'off',
    'consistent-return': 'off',
    'no-param-reassign': ['error', { props: false }],
    'prettier/prettier': [
      'error',
      {
        arrowParens: 'avoid',
        bracketSpacing: true,
        endOfLine: 'lf',
        jsxSingleQuote: true,
        printWidth: 80,
        quoteProps: 'as-needed',
        semi: false,
        singleQuote: true,
        tabs: false,
        tabWidth: 2,
        trailingComma: 'all',
      },
    ],
  },
}
