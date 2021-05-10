const CompressionPlugin = require('compression-webpack-plugin')

module.exports = function override(config, env) {
  if (!config.plugins) {
      config.plugins = [];
  }

  config.plugins.push(
    new CompressionPlugin()
  );

  return config;
}