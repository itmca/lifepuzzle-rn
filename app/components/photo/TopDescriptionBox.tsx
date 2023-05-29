import React from 'react';
import {TopDescriptionWrap, TopDescriptionText} from './styles';
import {SmallText} from '../styled/components/Text';

const TopDescriptionBox = (): JSX.Element => {
  return (
    <TopDescriptionWrap>
      <SmallText color={'#323232'} fontWeight={'bold'}>
        한 장의 사진은 그 자체로 많은 이야기를 담고 있습니다.
      </SmallText>
      <SmallText color={'#323232'} fontWeight={'bold'}>
        할부지의 인생 조각을 잘 기억할 수 있는 사진을 선택해주세요.
      </SmallText>
    </TopDescriptionWrap>
  );
};

export default TopDescriptionBox;
