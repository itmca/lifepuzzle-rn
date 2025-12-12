module.exports = {
  root: true,
  extends: '@react-native',
  rules: {
    // Enforce exhaustive dependencies in hooks to prevent infinite loops
    'react-hooks/exhaustive-deps': [
      'error',
      {
        // Add custom hooks that require stable dependencies
        additionalHooks:
          '(useImageDimensions|useSingleImageDimension|useCarouselManagement)',
      },
    ],
  },
};
