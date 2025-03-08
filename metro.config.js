const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const {
  createSentryMetroSerializer,
} = require('@sentry/react-native/dist/js/tools/sentryMetroSerializer');

const defaultConfig = getDefaultConfig(__dirname);

const customConfig = {
  transformer: {
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
  resolver: {
    assetExts: defaultConfig.resolver.assetExts.filter(ext => ext !== 'svg'),
    sourceExts: [...defaultConfig.resolver.sourceExts, 'svg'],
  },
  serializer: {
    customSerializer: createSentryMetroSerializer(),
  },
};

module.exports = mergeConfig(defaultConfig, customConfig);
