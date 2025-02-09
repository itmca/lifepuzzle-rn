import {GestureResponderEvent, TouchableOpacity} from 'react-native';
import {styles} from './styles';
import MediumText, {SmallText, XSmallText} from '../styled/components/Text';
import {ContentContainer} from '../styled/container/ContentContainer';
import {LegacyColor} from '../../constants/color.constant';
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
    <ContentContainer withContentPadding>
      <ContentContainer direction="horizontal">
        {story.question && (
          <SmallText
            color={LegacyColor.DARK_GRAY}
            style={styles.questionText}
            fontWeight={700}
            letterSpacing={-0.1}
            numberOfLines={inDetail ? 2 : 1}
            ellipsizeMode="tail">
            Q.{story.question}
          </SmallText>
        )}
        <SmallText color={LegacyColor.FONT_GRAY} letterSpacing={-0.3}>
          {getStoryDisplayDotDate(story.date)}
        </SmallText>
      </ContentContainer>
      <ContentContainer alignItems="flex-start">
        <MediumText
          style={styles.itemTitle}
          color={LegacyColor.LIGHT_BLACK}
          fontWeight={600}
          numberOfLines={inDetail ? 2 : 1}
          ellipsizeMode="tail">
          {story.title}
        </MediumText>
        {inDetail ? (
          <ContentContainer width="100%">
            <MediumText
              style={{lineHeight: 24}}
              color={LegacyColor.FONT_DARK}
              ellipsizeMode="tail">
              {story.content}
            </MediumText>
          </ContentContainer>
        ) : (
          <>
            <ContentContainer width="80%">
              <SmallText
                style={{lineHeight: 19}}
                letterSpacing={-0.1}
                color={LegacyColor.FONT_GRAY}
                numberOfLines={2}
                ellipsizeMode="tail">
                {story.content}
              </SmallText>
            </ContentContainer>
            <ContentContainer width="20%" alignItems="flex-end">
              <TouchableOpacity style={styles.readMoreButton} onPress={onPress}>
                <XSmallText
                  color={LegacyColor.WHITE}
                  letterSpacing={-0.5}
                  fontWeight={600}>
                  더보기
                </XSmallText>
              </TouchableOpacity>
            </ContentContainer>
          </>
        )}
      </ContentContainer>
    </ContentContainer>
  );
};
