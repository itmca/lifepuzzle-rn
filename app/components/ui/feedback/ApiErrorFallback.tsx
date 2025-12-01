import React from 'react';
import { ScreenContainer } from '../layout/ScreenContainer';
import { ContentContainer } from '../layout/ContentContainer';
import { BodyTextB, Title } from '../base/TextBase';
import { Color } from '../../../constants/color.constant';
import { SvgIcon } from '../display/SvgIcon';
import { BasicButton } from '../form/Button';

type Props = {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryText?: string;
};

export const ApiErrorFallback = ({
  title = '데이터를 불러올 수 없습니다',
  message = '네트워크 연결을 확인하고 다시 시도해주세요.',
  onRetry,
  retryText = '다시 시도',
}: Props): React.ReactElement => {
  return (
    <ScreenContainer edges={[]}>
      <ContentContainer
        flex={1}
        justifyContent="center"
        alignItems="center"
        gap={24}
        paddingHorizontal={20}
        marginTop={-80}
      >
        <ContentContainer alignItems="center" gap={12}>
          <SvgIcon name="error" size={48} color={Color.GREY_400} />
          <ContentContainer alignItems="center" gap={8}>
            <Title color={Color.GREY_800}>{title}</Title>
            <BodyTextB color={Color.GREY_600}>{message}</BodyTextB>
          </ContentContainer>
        </ContentContainer>

        {onRetry && <BasicButton text={retryText} onPress={onRetry} />}
      </ContentContainer>
    </ScreenContainer>
  );
};
