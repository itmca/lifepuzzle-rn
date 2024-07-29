import React from 'react';
import StoryItem from './StoryItem';
import {StoryType} from '../../types/story.type';
import {MediumText} from '../../components/styled/components/Text';
import {ContentContainer} from '../../components/styled/container/ContentContainer';

type Props = {
  isFocused?: boolean;
  stories: StoryType[];
};

const StoryList = ({stories, isFocused}: Props): JSX.Element => {
  if (stories.length <= 0) {
    return (
      <ContentContainer>
        <MediumText>
          아직 맞춰진 조각이 없습니다. {'\n'}
          하단 글 작성하기 버튼을 통해 조각을 맞춰보세요.
        </MediumText>
      </ContentContainer>
    );
  }

  return (
    <ContentContainer>
      {stories.map((story: StoryType) => (
        <StoryItem key={story.id} story={story} isFocused={isFocused} />
      ))}
    </ContentContainer>
  );
};

export default StoryList;
