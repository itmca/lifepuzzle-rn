module.exports = {
  preset: 'react-native',
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|react-native-mmkv)/)',
  ],
  moduleNameMapper: {
    '^react-native-nitro-modules$':
      '<rootDir>/__mocks__/react-native-nitro-modules.js',
  },
};
