import styled, {css} from 'styled-components/native';
import {Platform, ScrollView} from 'react-native';
import React, {forwardRef, ReactNode, RefAttributes} from 'react';
import {NativeSyntheticEvent} from 'react-native/Libraries/Types/CoreEventTypes';
import {NativeScrollEvent} from 'react-native/Libraries/Components/ScrollView/ScrollView';
import {LegacyColor} from '../../../constants/color.constant.ts';

type ContentContainerProps = {
  // Size
  width?: number | 'auto' | `${number}%`;
  height?: number | 'auto' | `${number}%`;
  minHeight?: string;
  maxHeight?: string;

  // Layout
  useHorizontalLayout?: boolean;
  flex?: number;
  gap?: number;
  absoluteTopPosition?: boolean;
  absoluteBottomPosition?: boolean;
  absoluteLeftPosition?: boolean;
  absoluteRightPosition?: boolean;
  expandToEnd?: boolean;

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
  width: ${props => props.width ?? '100%'};
  height: ${props => props.height ?? 'auto'};
  ${props => props.minHeight && `min-height: ${props.minHeight}`}
  ${props => props.maxHeight && `max-height: ${props.maxHeight}`}

  /* Flex Basic */
  display: flex;
  ${props => props.expandToEnd && 'flex-grow: 1;'}
  ${props => props.flex && `flex: ${props.flex}`}
  
  /* Layout */
  flex-direction: ${props => (props.useHorizontalLayout ? 'row' : 'column')}
  justify-content: ${props =>
    props.useHorizontalLayout ? 'space-between' : 'flex-start'};
  align-items: ${props => (props.useHorizontalLayout ? 'center' : 'stretch')};
  gap: ${props => props.gap ?? 16}px;
  ${props =>
    (props.absoluteTopPosition ||
      props.absoluteBottomPosition ||
      props.absoluteLeftPosition ||
      props.absoluteRightPosition) &&
    'position: absolute;'}
  ${props => props.absoluteTopPosition && 'top: 0;'}
  ${props => props.absoluteBottomPosition && 'bottom: 0;'}
  ${props => props.absoluteLeftPosition && 'left: 0;'}
  ${props => props.absoluteRightPosition && 'right: 0;'}

  /* Align */
  ${props =>
    props.alignCenter && 'align-items: center; justify-content: center;'}
    ${props =>
    props.justifyContent && `justify-content: ${props.justifyContent};`}
    ${props => props.alignItems && `align-items: ${props.alignItems};`}

  
  /* Padding */
  ${props => props.withScreenPadding && 'padding: 16px 20px 16px 20px;'}
  ${props => props.withContentPadding && 'padding: 16px'}
  ${props =>
    props.paddingVertical !== undefined &&
    css`
      padding-top: ${props.paddingVertical}px;
      padding-bottom: ${props.paddingVertical}px;
    `}
  ${props =>
    props.paddingTop !== undefined &&
    `padding-top: ${props.paddingTop}px;
    `}
  ${props =>
    props.paddingBottom !== undefined &&
    css`
      padding-bottom: ${props.paddingBottom}px;
    `}
  ${props =>
    props.paddingHorizontal !== undefined &&
    css`
      padding-left: ${props.paddingHorizontal}px;
      padding-right: ${props.paddingHorizontal}px;
    `}
  
  /* Border & Shadow */
  ${props =>
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
  ${props => props.withBorder && `border: 1px solid ${LegacyColor.GRAY};`}
  ${props => props.withDebugBorder && 'border: 1px solid red;'}
  ${props => props.borderColor && `border-color: ${props.borderColor};`}
  border-radius: ${props => props.borderRadius ?? 0}px;

  ${props =>
    props.borderTopRadius &&
    `border-top-left-radius: ${props.borderTopRadius}px;`};
  ${props =>
    props.borderTopRadius &&
    `border-top-right-radius: ${props.borderTopRadius}px;`};
  ${props =>
    props.borderBottomRadius &&
    `border-bottom-left-radius: ${props.borderBottomRadius}px;`};
  ${props =>
    props.borderBottomRadius &&
    `border-bottom-right-radius: ${props.borderBottomRadius}px;`};

  /* ETC */
  background-color: ${props => props.backgroundColor ?? LegacyColor.WHITE};
  ${props => props.withNoBackground && 'background-color: transparent;'}
  opacity: ${props => props.opacity ?? 100};
  z-index: ${props => props.zIndex ?? 0};
  overflow: ${props => (props.showOverflow ? 'auto' : 'hidden')};
`;

type ScrollContentContainerProps = ContentContainerProps &
  RefAttributes<ScrollView> & {
    onScroll?:
      | ((event: NativeSyntheticEvent<NativeScrollEvent>) => void)
      | undefined;
    children?: ReactNode;
  };

export const ScrollContentContainer = forwardRef(
  (props: ScrollContentContainerProps, ref: React.LegacyRef<ScrollView>) => (
    <ScrollView
      ref={ref}
      onScroll={props.onScroll}
      scrollEventThrottle={100}
      style={{width: '100%'}}
      horizontal={props.useHorizontalLayout}
      automaticallyAdjustKeyboardInsets={true}
      showsVerticalScrollIndicator={false}>
      <ContentContainer {...(props as ContentContainerProps)}>
        {props.children}
      </ContentContainer>
    </ScrollView>
  ),
);
