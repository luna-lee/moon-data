module.exports = {
    root: true,
    env: {
        node: true
    },
    extends: ['plugin:vue/essential', 'eslint:recommended', '@vue/prettier'],
    parserOptions: {
        parser: 'babel-eslint'
    },
    globals: {
        APP_CONFIG: 'writable',
        globalThis: 'writable',
        AMap: 'writable'
    },
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-sparse-arrays': 'off',
        'arrow-body-style': 'off',
        'prettier/prettier': 'off',
        'no-prototype-builtins': 'off'
    }
};
