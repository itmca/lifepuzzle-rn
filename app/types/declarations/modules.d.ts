// Module declarations for missing TypeScript definitions

// SVG file declarations
declare module '*.svg' {
  import React from 'react';
  import { SvgProps } from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}

// React Native Fast Image
declare module 'react-native-fast-image' {
  import { Component } from 'react';
  import { ImageProps, ViewStyle, ImageStyle } from 'react-native';

  export interface FastImageSource {
    uri?: string;
    headers?: { [key: string]: string };
    priority?: 'low' | 'normal' | 'high';
    cache?: 'immutable' | 'web' | 'cacheOnly';
  }

  export interface FastImageProperties extends ImageProps {
    source: FastImageSource | number;
    defaultSource?: number;
    resizeMode?: 'contain' | 'cover' | 'stretch' | 'center';
    onLoadStart?(): void;
    onProgress?(event: {
      nativeEvent: { loaded: number; total: number };
    }): void;
    onLoad?(event: { nativeEvent: { width: number; height: number } }): void;
    onError?(): void;
    onLoadEnd?(): void;
    style?: ImageStyle | ViewStyle;
  }

  export default class FastImage extends Component<FastImageProperties> {
    static resizeMode: {
      contain: 'contain';
      cover: 'cover';
      stretch: 'stretch';
      center: 'center';
    };

    static priority: {
      low: 'low';
      normal: 'normal';
      high: 'high';
    };

    static cacheControl: {
      immutable: 'immutable';
      web: 'web';
      cacheOnly: 'cacheOnly';
    };

    static preload(sources: FastImageSource[]): void;
  }
}

// React Native Masonry List
declare module 'react-native-masonry-list' {
  import { Component } from 'react';
  import { ViewStyle, ListRenderItemInfo } from 'react-native';

  export interface MasonryListProps<T> {
    data: T[];
    numColumns?: number;
    renderItem: (
      info: ListRenderItemInfo<T> & { index: number },
    ) => React.ReactElement | null;
    getHeightForItem?: (item: T, index: number) => number;
    keyExtractor?: (item: T, index: number) => string;
    onEndReached?: () => void;
    onEndReachedThreshold?: number;
    ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null;
    ListFooterComponent?: React.ComponentType<any> | React.ReactElement | null;
    refreshing?: boolean;
    onRefresh?: () => void;
    contentContainerStyle?: ViewStyle;
    style?: ViewStyle;
    scrollEventThrottle?: number;
  }

  export default class MasonryList<T> extends Component<MasonryListProps<T>> {}
}

// Node.js process global
declare const process: {
  env: {
    [key: string]: string | undefined;
  };
};
