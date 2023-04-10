import React from 'react';
import {TopDescriptionWrap, TopDescriptionText} from './styles';

const TopDescriptionBox = (): JSX.Element => {
  return (
    <TopDescriptionWrap>
      <TopDescriptionText>
        한 장의 사진은 그 자체로 많은 이야기를 담고 있습니다.
      </TopDescriptionText>
      <TopDescriptionText>
        할부지의 인생 조각을 잘 기억할 수 있는 사진을 선택해주세요.
      </TopDescriptionText>
    </TopDescriptionWrap>
  );
};

export default TopDescriptionBox;
