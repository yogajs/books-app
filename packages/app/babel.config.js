module.exports = {
  presets: ['@babel/preset-react', 'module:metro-react-native-babel-preset', 'module:react-native-dotenv'],
  plugins: [
    '@babel/plugin-transform-flow-strip-types',
    '@babel/plugin-proposal-export-namespace-from',
    '@babel/plugin-proposal-export-default-from',
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    'optional-require',
    'babel-plugin-styled-components',
    'babel-plugin-idx',
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-proposal-async-generator-functions',
    '@babel/plugin-proposal-optional-chaining',
  ],
  sourceMaps: true,
};
