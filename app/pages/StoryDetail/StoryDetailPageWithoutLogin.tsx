import React, {useEffect, useState} from 'react';
import {ScrollView, Text, View} from 'react-native';
import StoryPhotoCarousel from '../../components/story/StoryPhotoCarousel';
import {styles} from './styles';
import {StoryType} from '../../types/story.type';
import {getStoryDisplayTagsDate} from '../../service/story-display.service';
import {StoryAudioPlayer} from '../../components/story/StoryAudioPlayer';
import {NoOutLineScreenContainer} from '../../components/styled/container/ScreenContainer';
import {useRecoilValue} from 'recoil';
import {DUMMY_STORY_LIST} from '../../constants/dummy-story-list.constant';
import {SelectedStoryKeyState} from '../../recoils/selected-story-id.recoil';

const StoryDetailPageWithoutLogin = (): JSX.Element => {
  const storyKey = useRecoilValue(SelectedStoryKeyState);
  const [story, setStory] = useState<StoryType>();

  useEffect(() => {
    const dummyStory: StoryType[] = DUMMY_STORY_LIST.filter(
      story => story.id === storyKey,
    );

    setStory(dummyStory[0]);
  }, [storyKey]);

  if (!story) {
    return <></>;
  }

  return (
    <NoOutLineScreenContainer>
      <ScrollView>
        <StoryPhotoCarousel
          photos={story?.photos}
          containerStyle={{
            height: 360,
          }}
        />
        <View style={styles.contentMainContainer}>
          <View style={styles.contentTopPartContainer}>
            <View>
              <Text style={{fontSize: 24}}>{story.title}</Text>
              <Text style={{fontSize: 12}}>
                {getStoryDisplayTagsDate(story)}
              </Text>
            </View>
            <StoryAudioPlayer audioURL={story.audios[0]} />
          </View>
          <Text>{story.content}</Text>
        </View>
      </ScrollView>
    </NoOutLineScreenContainer>
  );
};
export default StoryDetailPageWithoutLogin;
