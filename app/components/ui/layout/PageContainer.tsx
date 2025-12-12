import React, { ReactNode } from 'react';
import { Edge } from 'react-native-safe-area-context';
import { ScreenContainer } from './ScreenContainer';
import { LoadingContainer } from '../feedback/LoadingContainer';
import { ApiErrorFallback } from '../feedback/ApiErrorFallback';

type PageContainerProps = {
  children: ReactNode;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  edges?: ReadonlyArray<Edge>;
  justifyContent?: string;
  alignItems?: string;
  gap?: number;
  withUpperShadow?: boolean;
  withBorder?: boolean;
  withDebugBorder?: boolean;
  borderRadius?: number;
};

/**
 * PageContainer
 *
 * 페이지의 최상위 컨테이너로, SafeArea, 로딩, 에러 처리를 통합합니다.
 * 모든 페이지는 이 컨테이너로 시작하는 것을 권장합니다.
 *
 * @example
 * // 기본 사용
 * <PageContainer isLoading={isLoading}>
 *   <ContentContainer withScreenPadding>
 *     {내용}
 *   </ContentContainer>
 * </PageContainer>
 *
 * @example
 * // 에러 처리 포함
 * <PageContainer isLoading={isLoading} isError={isError} onRetry={refetch}>
 *   {내용}
 * </PageContainer>
 */
export const PageContainer = ({
  children,
  isLoading = false,
  isError = false,
  onRetry,
  edges = ['left', 'right', 'bottom'],
  ...screenProps
}: PageContainerProps): React.ReactElement => {
  if (isError && onRetry) {
    return (
      <ScreenContainer edges={edges} {...screenProps}>
        <ApiErrorFallback onRetry={onRetry} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer edges={edges} {...screenProps}>
      <LoadingContainer isLoading={isLoading}>{children}</LoadingContainer>
    </ScreenContainer>
  );
};
