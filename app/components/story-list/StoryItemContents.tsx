import {GestureResponderEvent, TouchableOpacity} from 'react-native';
import {styles} from './styles';
import MediumText, {SmallText, XXSmallText} from '../styled/components/Text';
import {ContentContainer} from '../styled/container/ContentContainer';
import {Color} from '../../constants/color.constant';
import React from 'react';
import {getStoryDisplayDotDate} from '../../service/story-display.service';
import {StoryType} from '../../types/story.type';

type props = {
  story: StoryType;
  inDetail?: boolean;
  onPress?: ((event: GestureResponderEvent) => void) | undefined;
};

export const StoryItemContents = ({
  story,
  inDetail,
  onPress,
}: props): JSX.Element => {
  return (
    <ContentContainer withContentPadding gap={12}>
      <SmallText color={Color.FONT_GRAY} letterSpacing={-0.3}>
        {getStoryDisplayDotDate(story.date)}
      </SmallText>
      {story.question && (
        <SmallText
          color={Color.DARK_GRAY}
          fontWeight={700}
          letterSpacing={-0.1}
          numberOfLines={inDetail ? 2 : 1}
          ellipsizeMode="tail">
          Q.{story.question}
        </SmallText>
      )}
      <ContentContainer gap={8}>
        <MediumText
          color={Color.LIGHT_BLACK}
          fontWeight={600}
          ellipsizeMode="tail">
          {story.title}
        </MediumText>
        <ContentContainer useHorizontalLayout gap={4}>
          <ContentContainer flex={1}>
            <SmallText
              color={Color.FONT_GRAY}
              numberOfLines={2}
              ellipsizeMode="tail">
              {story.content}
            </SmallText>
          </ContentContainer>
          {inDetail ? undefined : (
            <ContentContainer width={'40px'}>
              <TouchableOpacity style={styles.readMoreButton} onPress={onPress}>
                <XXSmallText color={Color.WHITE} fontWeight={600} alignCenter>
                  더보기
                </XXSmallText>
              </TouchableOpacity>
            </ContentContainer>
          )}
        </ContentContainer>
      </ContentContainer>
    </ContentContainer>
  );
};
