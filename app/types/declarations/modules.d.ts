// Module declarations for missing TypeScript definitions

// SVG file declarations
declare module '*.svg' {
  import React from 'react';
  import { SvgProps } from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}

// React Native Masonry List
declare module 'react-native-masonry-list' {
  import { Component } from 'react';
  import { ViewStyle, ImageStyle } from 'react-native';

  export interface MasonryImage {
    uri: string;
    id?: string | number;
    [key: string]: any;
  }

  export interface BrickProps {
    imageContainerStyle?: ImageStyle | ViewStyle;
  }

  export interface MasonryListProps {
    itemSource?: any[];
    images?: MasonryImage[];
    containerWidth?: number;

    columns?: number;
    spacing?: number;
    initialColToRender?: number;
    initialNumInColsToRender?: number;
    sorted?: boolean;
    backgroundColor?: string;
    imageContainerStyle?: ViewStyle | ImageStyle;
    listContainerStyle?: ViewStyle;
    renderIndividualHeader?: React.ComponentType<any> | React.ReactElement;
    renderIndividualFooter?: React.ComponentType<any> | React.ReactElement;
    masonryFlatListColProps?: object;
    rerender?: boolean;

    customImageComponent?: React.ComponentType<any> | React.ReactElement;
    customImageProps?: object;
    completeCustomComponent?: React.ComponentType<any> | React.ReactElement;

    onImageResolved?: (data: any) => void;
    onImagesResolveEnd?: () => void;

    onPressImage?: (item: any, index?: number) => void;
    onLongPressImage?: (item: any, index?: number) => void;

    emptyView?: React.ComponentType<any> | React.ReactElement;
    onEndReached?: () => void;
    onEndReachedThreshold?: number;
    refreshing?: boolean;
    onRefresh?: () => void;

    // Additional prop that may exist
    brickProps?: BrickProps;
  }

  export default class MasonryList extends Component<MasonryListProps> {}
}

// Node.js process global
declare const process: {
  env: {
    [key: string]: string | undefined;
  };
};
