import {Dimensions} from 'react-native';
import {useRecoilState, useRecoilValue} from 'recoil';
import {ScreenContainer} from '../../components/styled/container/ScreenContainer';
import {MediaCarousel} from '../../components/story/MediaCarousel.tsx';
import {StoryItemContents} from '../../components/story-list/StoryItemContents';
import {useIsFocused} from '@react-navigation/native';
import {
  ContentContainer,
  ScrollContentContainer,
} from '../../components/styled/container/ContentContainer.tsx';

import {LegacyColor} from '../../constants/color.constant.ts';
import {MediumTitle} from '../../components/styled/components/Title.tsx';
import {
  getGallery,
  selectedGalleryIndexState,
} from '../../recoils/photos.recoil.ts';

const StoryDetailPageWithoutLogin = (): JSX.Element => {
  const [galleryIndex, setGalleryIndex] = useRecoilState(
    selectedGalleryIndexState,
  );

  const gallery = useRecoilValue(getGallery);
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

        <ContentContainer backgroundColor={LegacyColor.BLACK}>
          <MediaCarousel
            data={gallery.map(item => ({
              type: item.type,
              url: item.url,
              index: item.index,
            }))}
            activeIndex={galleryIndex}
            isFocused={isFocused}
            carouselWidth={Dimensions.get('window').width}
            onScroll={index => {
              setGalleryIndex(index % gallery.length);
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
