const packages = ['app'];

module.exports = {
  watchman: false,
  src: './src',
  schema: '../schema/schema.graphql',
  language: 'typescript',
  include: [...packages.map((pkg) => `./${pkg}/src/**`)],
};
