import styled, { css } from 'styled-components/native';
import {
  Keyboard,
  LayoutChangeEvent,
  Platform,
  Pressable,
  ScrollView,
} from 'react-native';
import React, { forwardRef, ReactNode, RefAttributes } from 'react';
import { NativeSyntheticEvent } from 'react-native/Libraries/Types/CoreEventTypes';
import { NativeScrollEvent } from 'react-native/Libraries/Components/ScrollView/ScrollView';
import { Color } from '../../../constants/color.constant.ts';
import { SizeValue } from '../../../types/ui/style.type';
import { formatSize } from '../../../utils/style.util.ts';

type ContentContainerProps = {
  // Size
  width?: SizeValue;
  height?: SizeValue;
  minHeight?: SizeValue;
  maxHeight?: SizeValue;

  // Layout
  useHorizontalLayout?: boolean;
  flex?: number;
  gap?: number;
  absoluteTopPosition?: boolean;
  absoluteBottomPosition?: boolean;
  absoluteLeftPosition?: boolean;
  absoluteRightPosition?: boolean;
  expandToEnd?: boolean;
  aspectRatio?: number;

  // Align
  alignCenter?: boolean;
  justifyContent?: string;
  alignItems?: string;

  // Padding
  withScreenPadding?: boolean;
  withContentPadding?: boolean;
  paddingVertical?: number;
  paddingHorizontal?: number;
  paddingTop?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  paddingRight?: number;

  // Border & Shadow
  withUpperShadow?: boolean;
  withBorder?: boolean;
  withDebugBorder?: boolean;
  borderColor?: string;
  borderRadius?: number;
  borderTopRadius?: number;
  borderBottomRadius?: number;

  // ETC
  opacity?: number;
  zIndex?: number;
  backgroundColor?: string;
  withNoBackground?: boolean;
  showOverflow?: boolean;
};

export const ContentContainer = styled.View<ContentContainerProps>`
  /* Size */
  width: ${(props: ContentContainerProps) => formatSize(props.width, '100%')};
  height: ${(props: ContentContainerProps) => formatSize(props.height, 'auto')};
  ${(props: ContentContainerProps) =>
    props.minHeight && `min-height: ${formatSize(props.minHeight, 'auto')};`}
  ${(props: ContentContainerProps) =>
    props.maxHeight && `max-height: ${formatSize(props.maxHeight, 'none')};`}

  /* Flex Basic */
  display: flex;
  ${(props: ContentContainerProps) => props.expandToEnd && 'flex-grow: 1;'}
  ${(props: ContentContainerProps) => props.flex && `flex: ${props.flex};`}

  /* Layout */
  flex-direction: ${(props: ContentContainerProps) =>
    props.useHorizontalLayout ? 'row' : 'column'};
  justify-content: ${(props: ContentContainerProps) =>
    props.useHorizontalLayout ? 'space-between' : 'flex-start'};
  align-items: ${(props: ContentContainerProps) =>
    props.useHorizontalLayout ? 'center' : 'stretch'};
  gap: ${(props: ContentContainerProps) => props.gap ?? 16}px;
  ${(props: ContentContainerProps) =>
    (props.absoluteTopPosition ||
      props.absoluteBottomPosition ||
      props.absoluteLeftPosition ||
      props.absoluteRightPosition) &&
    'position: absolute;'}
  ${(props: ContentContainerProps) => props.absoluteTopPosition && 'top: 0;'}
  ${(props: ContentContainerProps) =>
    props.absoluteBottomPosition && 'bottom: 0;'}
  ${(props: ContentContainerProps) => props.absoluteLeftPosition && 'left: 0;'}
  ${(props: ContentContainerProps) =>
    props.absoluteRightPosition && 'right: 0;'}
  ${(props: ContentContainerProps) =>
    props.aspectRatio && `aspect-ratio: ${props.aspectRatio};`};

  /* Align */
  ${(props: ContentContainerProps) =>
    props.alignCenter && 'align-items: center; justify-content: center;'}
  ${(props: ContentContainerProps) =>
    props.justifyContent && `justify-content: ${props.justifyContent};`}
    ${(props: ContentContainerProps) =>
    props.alignItems && `align-items: ${props.alignItems};`}


  /* Padding */
  ${(props: ContentContainerProps) =>
    props.withScreenPadding && 'padding: 16px 20px 16px 20px;'}
  ${(props: ContentContainerProps) =>
    props.withContentPadding && 'padding: 16px;'}
  ${(props: ContentContainerProps) =>
    props.paddingVertical !== undefined &&
    css`
      padding-top: ${props.paddingVertical}px;
      padding-bottom: ${props.paddingVertical}px;
    `}
  ${(props: ContentContainerProps) =>
    props.paddingTop !== undefined &&
    `padding-top: ${props.paddingTop}px;
    `}
  ${(props: ContentContainerProps) =>
    props.paddingBottom !== undefined &&
    css`
      padding-bottom: ${props.paddingBottom}px;
    `}
  ${(props: ContentContainerProps) =>
    props.paddingHorizontal !== undefined &&
    css`
      padding-left: ${props.paddingHorizontal}px;
      padding-right: ${props.paddingHorizontal}px;
    `}

  /* Border & Shadow */
  ${(props: ContentContainerProps) =>
    props.withUpperShadow &&
    Platform.select({
      ios: `
      shadow-offset: {width: 0, height: -4px}; /* Upper shadow */
      shadow-opacity: 0.2; /* Full opacity since rgba already has the alpha */
      shadow-radius: 4px; /* Blur radius */
    `,
      android: `
        elevation: 4; /* Android shadow effect */
      `,
    })}
  ${(props: ContentContainerProps) =>
    props.withBorder && `border: 1px solid ${Color.GREY};`}
  ${(props: ContentContainerProps) =>
    props.withDebugBorder && 'border: 1px solid red;'}
  ${(props: ContentContainerProps) =>
    props.borderColor && `border-color: ${props.borderColor};`}
  border-radius: ${(props: ContentContainerProps) => props.borderRadius ?? 0}px;

  ${(props: ContentContainerProps) =>
    props.borderTopRadius &&
    `border-top-left-radius: ${props.borderTopRadius}px;`};
  ${(props: ContentContainerProps) =>
    props.borderTopRadius &&
    `border-top-right-radius: ${props.borderTopRadius}px;`};
  ${(props: ContentContainerProps) =>
    props.borderBottomRadius &&
    `border-bottom-left-radius: ${props.borderBottomRadius}px;`};
  ${(props: ContentContainerProps) =>
    props.borderBottomRadius &&
    `border-bottom-right-radius: ${props.borderBottomRadius}px;`};

  /* ETC */
  background-color: ${(props: ContentContainerProps) =>
    props.backgroundColor ?? Color.WHITE};
  ${(props: ContentContainerProps) =>
    props.withNoBackground && 'background-color: transparent;'}
  opacity: ${(props: ContentContainerProps) => props.opacity ?? 100};
  z-index: ${(props: ContentContainerProps) => props.zIndex ?? 0};
  overflow: ${(props: ContentContainerProps) =>
    props.showOverflow ? 'auto' : 'hidden'};
`;

type ScrollContentContainerProps = ContentContainerProps &
  RefAttributes<ScrollView> & {
    onScroll?:
      | ((event: NativeSyntheticEvent<NativeScrollEvent>) => void)
      | undefined;
    onLayout?: ((event: LayoutChangeEvent) => void) | undefined;
    scrollEventThrottle?: number | undefined;
    dismissKeyboardOnPress?: boolean;
    children?: ReactNode;
  };
export const ScrollContentContainer = forwardRef(
  (props: ScrollContentContainerProps, ref: React.LegacyRef<ScrollView>) => {
    const content = (
      <ContentContainer {...(props as ContentContainerProps)}>
        {props.children}
      </ContentContainer>
    );

    return (
      <ScrollView
        ref={ref}
        onScroll={props.onScroll}
        onScrollBeginDrag={
          props.dismissKeyboardOnPress ? () => Keyboard.dismiss() : undefined
        }
        scrollEventThrottle={100}
        style={{ width: '100%' }}
        horizontal={props.useHorizontalLayout}
        automaticallyAdjustKeyboardInsets={true}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        {props.dismissKeyboardOnPress ? (
          <Pressable onPress={Keyboard.dismiss}>{content}</Pressable>
        ) : (
          content
        )}
      </ScrollView>
    );
  },
);
