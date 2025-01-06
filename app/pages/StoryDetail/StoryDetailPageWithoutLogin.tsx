import {useState} from 'react';
import {Dimensions} from 'react-native';
import {useRecoilState, useRecoilValue, useSetRecoilState} from 'recoil';
import {ScreenContainer} from '../../components/styled/container/ScreenContainer';
import {MediaCarousel} from '../../components/story/MediaCarousel.tsx';
import {StoryItemContents} from '../../components/story-list/StoryItemContents';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {writingStoryState} from '../../recoils/story-write.recoil';
import {
  ContentContainer,
  ScrollContentContainer,
} from '../../components/styled/container/ContentContainer.tsx';

import {Color} from '../../constants/color.constant.ts';
import {MediumTitle} from '../../components/styled/components/Title.tsx';
import {BasicNavigationProps} from '../../navigation/types.tsx';
import {
  selectedGalleryIndexState,
  getGallery,
} from '../../recoils/photos.recoil.ts';

const StoryDetailPageWithoutLogin = (): JSX.Element => {
  const navigation = useNavigation<BasicNavigationProps>();

  const [galleryIndex, setGalleryIndex] = useRecoilState(
    selectedGalleryIndexState,
  );

  const gallery = useRecoilValue(getGallery);
  const [isStory, setIsStory] = useState<boolean>(gallery[galleryIndex].story);

  const setWritingStory = useSetRecoilState(writingStoryState);
  const isFocused = useIsFocused();

  return (
    <ScreenContainer>
      <ScrollContentContainer gap={16}>
        <ContentContainer
          useHorizontalLayout
          paddingHorizontal={16}
          alignItems="flex-end"
          height={Dimensions.get('window').height * 0.1 + 'px' ?? '10%'}>
          <MediumTitle>{gallery[galleryIndex].tag?.label ?? ''}</MediumTitle>
        </ContentContainer>

        <ContentContainer backgroundColor={Color.BLACK}>
          <MediaCarousel
            data={gallery.map(item => ({
              type: item.type,
              url: item.url,
            }))}
            activeIndex={galleryIndex}
            isFocused={isFocused}
            carouselWidth={Dimensions.get('window').width}
            onScroll={index => {
              setGalleryIndex(index % gallery.length);
              setIsStory(gallery[index % gallery.length].story);
            }}
          />
        </ContentContainer>
        <ContentContainer
          paddingHorizontal={16}
          paddingBottom={10}
          flex={1}
          expandToEnd>
          {gallery[galleryIndex]?.story && (
            <StoryItemContents story={gallery[galleryIndex].story} />
          )}
        </ContentContainer>
      </ScrollContentContainer>
    </ScreenContainer>
  );
};
export default StoryDetailPageWithoutLogin;
