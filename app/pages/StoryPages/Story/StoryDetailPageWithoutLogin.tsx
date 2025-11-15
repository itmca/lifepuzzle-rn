import {Dimensions} from 'react-native';
import {useRecoilState, useRecoilValue} from 'recoil';
import {ScreenContainer} from '../../components/ui/layout/ScreenContainer';
import {MediaCarousel} from '../../components/feature/story/MediaCarousel.tsx';
import {StoryItemContents} from '../../components/feature/story/StoryItemContents';
import {useIsFocused} from '@react-navigation/native';
import {
  ContentContainer,
  ScrollContentContainer,
} from '../../../components/ui/layout/ContentContainer.tsx';

import {Color} from '../../constants/color.constant.ts';
import {
  getGallery,
  selectedGalleryIndexState,
} from '../../recoils/content/media.recoil.ts';
import {Title} from '../../components/ui/base/TextBase';

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
          <Title>{gallery[galleryIndex].tag?.label ?? ''}</Title>
        </ContentContainer>

        <ContentContainer backgroundColor={Color.BLACK}>
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
