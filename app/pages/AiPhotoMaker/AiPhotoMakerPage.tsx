import {useRef, useState} from 'react';
import {ScrollView} from 'react-native';
import {useRecoilState, useRecoilValue} from 'recoil';
import {useNavigation} from '@react-navigation/native';
import {LoadingContainer} from '../../components/loadding/LoadingContainer.tsx';
import {ScreenContainer} from '../../components/styled/container/ScreenContainer.tsx';
import {
  ContentContainer,
  ScrollContentContainer,
} from '../../components/styled/container/ContentContainer.tsx';
import {Title} from '../../components/styled/components/Text.tsx';
import {Photo} from '../../components/styled/components/Image.tsx';
import {AiPhotoMakerButton} from '../../components/button/AiPhotoMakerButton.tsx';
import SelectableAiPhotoTemplate from '../../components/aiphoto/SelectableAiPhotoTemplate.tsx';
import {CustomAlert} from '../../components/alert/CustomAlert';
import {Color} from '../../constants/color.constant.ts';
import {BasicNavigationProps} from '../../navigation/types.tsx';
import {
  getGallery,
  selectedGalleryIndexState,
} from '../../recoils/photos.recoil.ts';
import {AiPhotoTemplate} from '../../types/ai-photo.type.ts';
import {useAiPhotoTemplate} from '../../service/hooks/ai-photo.query.hook.ts';
import {useCreateAiPhoto} from '../../service/hooks/ai-photo.create.hook.ts';

const AiPhotoMakerPage = (): JSX.Element => {
  const navigation = useNavigation<BasicNavigationProps>();
  const scrollRef = useRef<ScrollView>(null);

  const {
    drivingVideos: aiPhotoTemplate,
    isLoading,
    refetch,
  } = useAiPhotoTemplate();
  const gallery = useRecoilValue(getGallery);
  const [galleryIndex] = useRecoilState(selectedGalleryIndexState);
  const [selectedTemplateId, setSelectedTemplateId] = useState<number>(-1);

  const onClickMake = () => {
    if (!gallery[galleryIndex].id) {
      CustomAlert.simpleAlert('선택된 사진을 확인할 수 없습니다.');
      return false;
    }
    if (!selectedTemplateId) {
      CustomAlert.simpleAlert('움직임을 선택해 주세요.');
      return false;
    }
    useCreateAiPhoto({
      photoId: gallery[galleryIndex].id,
      drivingVideoId: selectedTemplateId,
    });
  };
  return (
    <LoadingContainer isLoading={false}>
      <ScreenContainer>
        <ScrollContentContainer>
          <ContentContainer withScreenPadding gap={20}>
            <ContentContainer
              flex={1}
              backgroundColor={Color.GREY_700}
              borderRadius={6}
              height={376}>
              <Photo
                resizeMode={'contain'}
                source={{
                  uri: gallery[galleryIndex].url,
                }}
              />
            </ContentContainer>
            <ContentContainer flex={1} expandToEnd>
              <>
                <Title color={Color.GREY_900}>움직임을 선택해 주세요</Title>
                <ScrollContentContainer
                  useHorizontalLayout
                  gap={6}
                  ref={scrollRef}>
                  {aiPhotoTemplate.map((item: AiPhotoTemplate, index) => {
                    return (
                      <SelectableAiPhotoTemplate
                        key={item.id}
                        onSelected={(item: AiPhotoTemplate) => {
                          setSelectedTemplateId(item.id);
                        }}
                        onDeselected={(item: AiPhotoTemplate) => {
                          setSelectedTemplateId(-1);
                        }}
                        size={90}
                        data={item}
                        selected={
                          selectedTemplateId !== -1 &&
                          item.id === selectedTemplateId
                        }
                      />
                    );
                  })}
                </ScrollContentContainer>
                <ContentContainer alignCenter paddingTop={20}>
                  <AiPhotoMakerButton onPress={onClickMake} />
                </ContentContainer>
              </>
            </ContentContainer>
          </ContentContainer>
        </ScrollContentContainer>
      </ScreenContainer>
    </LoadingContainer>
  );
};
export default AiPhotoMakerPage;
