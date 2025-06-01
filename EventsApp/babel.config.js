// babel.config.js
module.exports = function(api) {
  api.cache(true);
  return {
    presets: [
      'babel-preset-expo'
    ],
    plugins: [
      // Reanimated плагин — всегда последним!
      'react-native-reanimated/plugin',
    ],
  };
};
