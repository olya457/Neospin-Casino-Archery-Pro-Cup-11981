const path = require('path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const excludedDirectories = [
  'ios/Pods',
  'ios/build',
  'android/build',
  'android/.gradle',
  'android/app/build',
  'android/app/.cxx',
  'vendor',
];
const config = {
  resolver: {
    blockList: excludedDirectories.map(directory => {
      const absolutePath = path
        .resolve(__dirname, directory)
        .replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      return new RegExp(`^${absolutePath}[/\\\\].*`);
    }),
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
