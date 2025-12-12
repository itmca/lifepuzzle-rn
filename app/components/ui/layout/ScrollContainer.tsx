import React, { forwardRef, ReactNode, RefAttributes } from 'react';
import {
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  RefreshControl,
  ScrollView,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

type ScrollContainerBaseProps = {
  children: ReactNode;
  keyboardAware?: boolean;
  horizontal?: boolean;
  contentContainerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  showsVerticalScrollIndicator?: boolean;
  showsHorizontalScrollIndicator?: boolean;
  onScroll?:
    | ((event: NativeSyntheticEvent<NativeScrollEvent>) => void)
    | undefined;
  onLayout?: ((event: LayoutChangeEvent) => void) | undefined;
  scrollEventThrottle?: number;
  onRefresh?: () => void;
  refreshing?: boolean;
  bottomOffset?: number;
  keyboardShouldPersistTaps?: 'always' | 'never' | 'handled';
};

type ScrollContainerProps = ScrollContainerBaseProps &
  RefAttributes<ScrollView>;

/**
 * ScrollContainer
 *
 * 스크롤과 키보드 처리를 통합한 컨테이너입니다.
 * keyboardAware prop으로 키보드 처리 여부를 선택할 수 있습니다.
 *
 * @example
 * // 일반 스크롤
 * <ScrollContainer>
 *   <ContentContainer withScreenPadding>
 *     {내용}
 *   </ContentContainer>
 * </ScrollContainer>
 *
 * @example
 * // 키보드 처리가 필요한 폼
 * <ScrollContainer keyboardAware>
 *   <ContentContainer withScreenPadding>
 *     <TextInput />
 *     <TextInput />
 *   </ContentContainer>
 * </ScrollContainer>
 *
 * @example
 * // Pull to Refresh
 * <ScrollContainer onRefresh={refetch} refreshing={isRefreshing}>
 *   {내용}
 * </ScrollContainer>
 */
export const ScrollContainer = forwardRef<ScrollView, ScrollContainerProps>(
  (
    {
      children,
      keyboardAware = false,
      horizontal = false,
      contentContainerStyle,
      style = { width: '100%' },
      showsVerticalScrollIndicator = false,
      showsHorizontalScrollIndicator = false,
      onScroll,
      onLayout,
      scrollEventThrottle = 100,
      onRefresh,
      refreshing = false,
      bottomOffset = 20,
      keyboardShouldPersistTaps = 'handled',
    },
    ref,
  ) => {
    const refreshControl = onRefresh ? (
      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
    ) : undefined;

    if (keyboardAware) {
      return (
        <KeyboardAwareScrollView
          ref={ref}
          contentContainerStyle={contentContainerStyle}
          style={style}
          horizontal={horizontal}
          showsVerticalScrollIndicator={showsVerticalScrollIndicator}
          showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
          onScroll={onScroll}
          onLayout={onLayout}
          scrollEventThrottle={scrollEventThrottle}
          bottomOffset={bottomOffset}
          keyboardShouldPersistTaps={keyboardShouldPersistTaps}
          refreshControl={refreshControl}
        >
          {children}
        </KeyboardAwareScrollView>
      );
    }

    return (
      <ScrollView
        ref={ref}
        contentContainerStyle={contentContainerStyle}
        style={style}
        horizontal={horizontal}
        showsVerticalScrollIndicator={showsVerticalScrollIndicator}
        showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
        onScroll={onScroll}
        onLayout={onLayout}
        scrollEventThrottle={scrollEventThrottle}
        automaticallyAdjustKeyboardInsets={true}
        refreshControl={refreshControl}
      >
        {children}
      </ScrollView>
    );
  },
);

ScrollContainer.displayName = 'ScrollContainer';
