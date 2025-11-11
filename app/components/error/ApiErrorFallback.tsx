import React from 'react';
import {ScreenContainer} from '../styled/container/ScreenContainer';
import {ContentContainer} from '../styled/container/ContentContainer';
import {Title, BodyText} from '../styled/components/Text';
import {ButtonBase} from '../styled/components/Button';
import {Color} from '../../constants/color.constant';
import {SvgIcon} from '../styled/components/SvgIcon';

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
}: Props): JSX.Element => {
  return (
    <ScreenContainer>
      <ContentContainer
        flex={1}
        justifyContent="center"
        alignItems="center"
        gap={24}
        paddingHorizontal={20}>
        <ContentContainer alignItems="center" gap={12}>
          <SvgIcon name="error" size={48} color={Color.GREY_400} />
          <ContentContainer alignItems="center" gap={8}>
            <Title color={Color.GREY_800}>{title}</Title>
            <BodyText color={Color.GREY_600} textAlign="center">
              {message}
            </BodyText>
          </ContentContainer>
        </ContentContainer>

        {onRetry && (
          <ButtonBase
            backgroundColor={Color.PRIMARY_500}
            paddingHorizontal={24}
            paddingVertical={12}
            borderRadius={8}
            onPress={onRetry}>
            <BodyText color={Color.WHITE}>{retryText}</BodyText>
          </ButtonBase>
        )}
      </ContentContainer>
    </ScreenContainer>
  );
};
