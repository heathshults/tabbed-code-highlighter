module.exports = {
    env: {
        browser: true,
        commonjs: true,
        node: true,
        es6: true,
      },
    parser: 'babel-eslint',
    extends: ["eslint:recommended"],
    parserOptions: {
      ecmaVersion: 7,
      sourceType: 'module',
      ecmaFeatures: {
          jsx: true,
          impliedStrict: true,
          modules: true,
          experimentalObjectRestSpread: true
      },
    },

    rules: {
    'no-unused-vars': 'off',
    'no-unused-labels': 'off',
    // enable additional rules
    indent: ['warn', 2],
    'linebreak-style': ['error', 'unix'],
    quotes: ['warn', 'single'],
    semi: 'off',

    // override default options for rules from base configurations
    'comma-dangle': 'off',
    'no-cond-assign': ['error', 'always'],

    // disable rules from base configurations
    'brace-style': 'off',
    'no-console': 'off',
    'no-mixed-operators': 'off',
    'no-undef': 'off',
    'space-before-function-paren': 'off',
    'one-var': 'off',
    'padded-blocks': 'off',
    'no-trailing-spaces': 'off',
    'no-multiple-empty-lines': 'off',
    camelcase: 'off',
    'no-useless-escape': 'warn',
    'no-multi-spaces': 'off'
    }
};
