import {GestureResponderEvent} from 'react-native';
import MediumText from '../styled/components/Text';
import {ContentContainer} from '../styled/container/ContentContainer';
import {Color} from '../../constants/color.constant';
import {StoryType} from '../../types/photo.type';
import StoryDateInput from '../../pages/StoryWritingMain/StoryDateInput';
import {AudioBtn} from '../story/AudioBtn';

type props = {
  story: StoryType | undefined;
  onPress?: ((event: GestureResponderEvent) => void) | undefined;
};

export const StoryItemContents = ({story, onPress}: props): JSX.Element => {
  if (!story) return <></>;
  return (
    <ContentContainer gap={16}>
      <ContentContainer useHorizontalLayout>
        <StoryDateInput disabled value={story.date} />
        {story.audio && <AudioBtn audioUrl={story.audio} />}
      </ContentContainer>
      <ContentContainer gap={6}>
        {story.title && (
          <MediumText color={Color.LIGHT_BLACK} bold>
            {story.title}
          </MediumText>
        )}
        {story.content && (
          <ContentContainer flex={1}>
            <MediumText
              lineHeight={24}
              color={Color.FONT_DARK}
              ellipsizeMode="tail">
              {story.content}
            </MediumText>
          </ContentContainer>
        )}
      </ContentContainer>
    </ContentContainer>
  );
};
