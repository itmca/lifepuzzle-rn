import {TouchableOpacity, GestureResponderEvent, View} from 'react-native';
import {styles} from './styles';
import MediumText, {SmallText, XSmallText} from '../styled/components/Text';
import {
  ContentContainer,
  HorizontalContentContainer,
} from '../styled/container/ContentContainer';
import {Color} from '../../constants/color.constant';
import Icon from 'react-native-vector-icons/AntDesign';
import React from 'react';
import {getStoryDisplayDate} from '../../service/story-display.service';
import {StoryType} from '../../types/story.type';

type props = {
  story: StoryType;
  isOnlyText: boolean;
  onPress?: ((event: GestureResponderEvent) => void) | undefined;
};

export const Contents = ({story, isOnlyText, onPress}: props): JSX.Element => {
  return (
    <View
      style={
        isOnlyText ? styles.onlyTextItemContainer : styles.contentsContainer
      }>
      {story.question && (
        <HorizontalContentContainer gap="5" marginBottom="10px">
          <SmallText
            color={Color.DARK_GRAY}
            style={styles.questionText}
            fontWeight={'600'}
            numberOfLines={1}
            ellipsizeMode="tail">
            Q. {story.question}
          </SmallText>
          <XSmallText color={Color.FONT_GRAY} style={styles.date}>
            {getStoryDisplayDate(story.date)}
          </XSmallText>
        </HorizontalContentContainer>
      )}
      <MediumText
        style={{...styles.itemTitle, marginBottom: 13}}
        numberOfLines={1}
        ellipsizeMode="tail">
        {story.title}
      </MediumText>
      <HorizontalContentContainer alignItems="flex-start">
        <ContentContainer width={'80%'}>
          <SmallText
            style={{lineHeight: 19}}
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
