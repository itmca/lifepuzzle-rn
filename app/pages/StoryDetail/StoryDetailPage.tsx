import React, {useEffect, useState} from 'react';
import {SafeAreaView, ScrollView, Text, View} from 'react-native';
import {useRecoilValue} from 'recoil';
import StoryPhotoCarousel from '../../components/story/StoryPhotoCarousel';
import {SelectedStoryKeyState} from '../../recoils/selected-story-id.recoil';
import {styles} from './styles';
import {useAuthAxios} from '../../service/hooks/network.hook';
import {StoryType} from '../../types/story.type';
import {getStoryDisplayTagsDate} from '../../service/story-display.service';
import {StoryAudioPlayer} from '../../components/story/StoryAudioPlayer';
import {LoadingContainer} from '../../components/loadding/LoadingContainer';
import {
  NoOutLineScreenContainer,
  ScreenContainer,
} from '../../components/styled/container/ScreenContainer';

const StoryDetailPage = (): JSX.Element => {
  const storyKey = useRecoilValue(SelectedStoryKeyState);
  const [story, setStory] = useState<StoryType>();

  const [storiesLoading, fetchStory] = useAuthAxios<StoryType>({
    requestOption: {
      url: `/stories/${storyKey}`,
    },
    onResponseSuccess: setStory,
    disableInitialRequest: false,
  });

  useEffect(() => {
    setStory(undefined);

    fetchStory({
      url: `/stories/${storyKey}`,
    });
  }, [storyKey]);

  if (!story) {
    return <></>;
  }

  return (
    <LoadingContainer isLoading={storiesLoading}>
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
    </LoadingContainer>
  );
};
export default StoryDetailPage;
