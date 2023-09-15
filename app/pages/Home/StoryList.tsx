import React from 'react';
import StoryItem from './StoryItem';
import {StoryType} from '../../types/story.type';
import {MediumText} from '../../components/styled/components/Text';
import {SmallTitle} from '../../components/styled/components/Title';
import {ContentContainer} from '../../components/styled/container/ContentContainer';
import {Color} from '../../constants/color.constant';

type Props = {
  stories: StoryType[];
};

const StoryList = ({stories}: Props): JSX.Element => {
  if (stories.length <= 0) {
    return (
      <ContentContainer
        flex={1}
        padding={16}
        gap="16px"
        backgroundColor={Color.WHITE}>
        <SmallTitle style={{marginTop: 8, marginLeft: 5}}>나의 조각</SmallTitle>
        <MediumText style={{marginLeft: 5}}>
          아직 맞춰진 조각이 없습니다. {'\n'}
          하단 글 작성하기 버튼을 통해 조각을 맞춰보세요.
        </MediumText>
      </ContentContainer>
    );
  }

  return (
    <ContentContainer
      flex={1}
      padding={16}
      gap="16px"
      backgroundColor={Color.WHITE}>
      <SmallTitle style={{marginTop: 8, marginLeft: 5}}>나의 조각</SmallTitle>
      {stories.map((story: StoryType) => (
        <StoryItem key={story.id} story={story} />
      ))}
    </ContentContainer>
  );
};

export default StoryList;
