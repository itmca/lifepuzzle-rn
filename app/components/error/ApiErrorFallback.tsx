import React from 'react';
import {ScreenContainer} from '../styled/container/ScreenContainer';
import {ContentContainer} from '../styled/container/ContentContainer';
import {BodyTextB, Title} from '../styled/components/Text';
import {Color} from '../../constants/color.constant';
import {SvgIcon} from '../styled/components/SvgIcon';
import {BasicButton} from '../button/BasicButton.tsx';

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
        /** TODO: alignCenter 속성을 주는 것과 justifyContent, alignItems 개별 속성을 center로 하는 것이 차이가 있어 확인 필요. */
        justifyContent="center"
        alignItems="center"
        gap={24}
        paddingHorizontal={20}>
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
