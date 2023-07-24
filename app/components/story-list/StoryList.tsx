import React from 'react';
import {StyleSheet, View} from 'react-native';
import StoryItem from './StoryItem';
import {StoryType} from '../../types/story.type';
import {MediumText} from '../styled/components/Text';
import {SmallTitle} from '../styled/components/Title';

type Props = {
  stories: StoryType[];
};

const styles = StyleSheet.create({
  storyListContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    height: '100%',
    paddingVertical: 16,
    paddingHorizontal: 16,
    gap: 16,
  },
  storyListTitle: {
    marginTop: 8,
    marginLeft: 5,
  },
});

const StoryList = ({stories}: Props): JSX.Element => {
  if (stories.length <= 0) {
    return (
      <View style={styles.storyListContainer}>
        <SmallTitle style={{marginTop: 8, marginLeft: 5}}>나의 조각</SmallTitle>
        <MediumText style={{marginLeft: 5}}>
          아직 맞춰진 조각이 없습니다.
        </MediumText>
        <MediumText style={{marginLeft: 5}}>
          하단 글 작성하기 버튼을 통해 조각을 맞춰보세요.
        </MediumText>
      </View>
    );
  }

  return (
    <View style={styles.storyListContainer}>
      <SmallTitle style={{marginTop: 8, marginLeft: 5}}>나의 조각</SmallTitle>
      {stories.map((story: StoryType) => (
        <StoryItem key={story.id} story={story} />
      ))}
    </View>
  );
};

export default StoryList;
