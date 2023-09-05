import {TouchableOpacity, GestureResponderEvent, View} from 'react-native';
import {styles} from './styles';
import MediumText, {SmallText, XSmallText} from '../styled/components/Text';
import {
  ContentContainer,
  HorizontalContentContainer,
} from '../styled/container/ContentContainer';
import {Color} from '../../constants/color.constant';
import React from 'react';
import {getStoryDisplayDotDate} from '../../service/story-display.service';
import {StoryType} from '../../types/story.type';

type props = {
  story: StoryType;
  inDetail?: boolean;
  onPress?: ((event: GestureResponderEvent) => void) | undefined;
};

export const Contents = ({story, inDetail, onPress}: props): JSX.Element => {
  return (
    <ContentContainer padding={16} justifyContent="center">
      <HorizontalContentContainer
        gap="5px"
        marginBottom={inDetail ? '25px' : '10px'}>
        {story.question && (
          <SmallText
            color={Color.DARK_GRAY}
            style={styles.questionText}
            fontWeight={700}
            letterSpacing={-0.1}
            numberOfLines={inDetail ? 2 : 1}
            ellipsizeMode="tail">
            Q.{story.question}
          </SmallText>
        )}
        <SmallText color={Color.FONT_GRAY} letterSpacing={-0.3}>
          {getStoryDisplayDotDate(story.date)}
        </SmallText>
      </HorizontalContentContainer>
      <MediumText
        style={styles.itemTitle}
        color={Color.LIGHT_BLACK}
        fontWeight={600}
        numberOfLines={inDetail ? 2 : 1}
        ellipsizeMode="tail">
        {story.title}
      </MediumText>
      <HorizontalContentContainer alignItems="flex-start">
        {inDetail ? (
          <ContentContainer width="100%">
            <MediumText
              style={{lineHeight: 24}}
              color={Color.FONT_DARK}
              numberOfLines={2}
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
                color={Color.FONT_GRAY}
                numberOfLines={2}
                ellipsizeMode="tail">
                {story.content}
              </SmallText>
            </ContentContainer>
            <ContentContainer width="20%" alignItems="flex-end">
              <TouchableOpacity style={styles.readMoreButton} onPress={onPress}>
                <XSmallText
                  color={Color.WHITE}
                  letterSpacing={-0.5}
                  fontWeight={600}>
                  더보기
                </XSmallText>
              </TouchableOpacity>
            </ContentContainer>
          </>
        )}
      </HorizontalContentContainer>
    </ContentContainer>
  );
};
