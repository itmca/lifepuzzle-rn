import {GestureResponderEvent, TouchableOpacity, View} from 'react-native';
import {styles} from './styles';
import {StoryType} from '../../types/story.type';
import {MediumText, SmallText, XSmallText} from '../styled/components/Text';
import {getStoryDisplayDate} from '../../service/story-display.service';
import {
  ContentContainer,
  HorizontalContentContainer,
} from '../styled/container/ContentContainer';
import {Color} from '../../constants/color.constant';
import React from 'react';

type props = {
  story: StoryType;
  onPress?: ((event: GestureResponderEvent) => void) | undefined;
};

export const TextOnlyContents = ({story, onPress}: props): JSX.Element => {
  const date = getStoryDisplayDate(story.date);

  return (
    <View style={styles.onlyTextItemContainer}>
      {story.question && (
        <HorizontalContentContainer marginBottom="10px">
          <SmallText
            color={Color.DARK_GRAY}
            style={styles.questionText}
            fontWeight={'600'}
            numberOfLines={1}
            ellipsizeMode="tail">
            Q. {story.question}
          </SmallText>
          <XSmallText color={Color.FONT_GRAY} style={styles.date}>
            {date}
          </XSmallText>
        </HorizontalContentContainer>
      )}
      <MediumText
        style={{...styles.itemTitle, marginBottom: 13}}
        color={Color.LIGHT_BLACK}
        fontWeight={500}
        numberOfLines={1}
        ellipsizeMode="tail">
        {story.title}
      </MediumText>
      <HorizontalContentContainer alignItems="center">
        <ContentContainer width={'80%'}>
          <SmallText
            style={{lineHeight: 20}}
            color={Color.FONT_GRAY}
            numberOfLines={2}
            ellipsizeMode="tail">
            {story.content}
          </SmallText>
        </ContentContainer>
        <ContentContainer width="20%" alignItems="flex-end">
          <TouchableOpacity style={styles.readMoreButton} onPress={onPress}>
            <XSmallText color={Color.WHITE} fontWeight={600}>
              더보기
            </XSmallText>
          </TouchableOpacity>
        </ContentContainer>
      </HorizontalContentContainer>
    </View>
  );
};
