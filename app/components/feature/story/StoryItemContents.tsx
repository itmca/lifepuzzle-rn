import React from 'react';
import { GestureResponderEvent } from 'react-native';
import { ContentContainer } from '../../ui/layout/ContentContainer';
import { Color } from '../../../constants/color.constant';
import { StoryType } from '../../../types/core/media.type';
import StoryDateInput from '../../../pages/StoryPages/StoryWriting/StoryDateInput';
import { AudioBtn } from './AudioBtn.tsx';
import { BodyTextM, Title } from '../../ui/base/TextBase';

type props = {
  story: StoryType | undefined;
  onPress?: ((event: GestureResponderEvent) => void) | undefined;
};

export const StoryItemContents = ({
  story,
  onPress,
}: props): React.ReactElement => {
  if (!story) {
    return <></>;
  }
  return (
    <ContentContainer gap={16}>
      <ContentContainer gap={12}>
        {story.title && <Title>{story.title}</Title>}
        {story.content && (
          <ContentContainer flex={1}>
            <BodyTextM color={Color.GREY_500}>{story.content}</BodyTextM>
          </ContentContainer>
        )}
      </ContentContainer>
      {story.audios && story.audios.length > 0 && (
        <AudioBtn audioUrl={story.audios[0]} onPlay={() => {}} />
      )}
      <StoryDateInput disabled value={story.date} onChange={() => {}} />
    </ContentContainer>
  );
};
