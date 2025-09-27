import {useRef, useState} from 'react';
import {ScrollView} from 'react-native';
import {useRecoilState, useRecoilValue} from 'recoil';
import {LoadingContainer} from '../../components/loadding/LoadingContainer.tsx';
import {ScreenContainer} from '../../components/styled/container/ScreenContainer.tsx';
import {useNavigation} from '@react-navigation/native';
import {
  ContentContainer,
  ScrollContentContainer,
} from '../../components/styled/container/ContentContainer.tsx';

import {Color} from '../../constants/color.constant.ts';
import {BasicNavigationProps} from '../../navigation/types.tsx';
import {
  getGallery,
  selectedGalleryIndexState,
} from '../../recoils/photos.recoil.ts';
import {Title} from '../../components/styled/components/Text.tsx';
import {Photo} from '../../components/styled/components/Image.tsx';
import {AiPhotoMakerButton} from '../../components/button/AiPhotoMakerButton.tsx';
import {useAiPhotoTemplate} from '../../service/hooks/ai-photo.query.hook.ts';
import SelectableAiPhotoTemplate from '../../components/aiphoto/SelectableAiPhotoTemplate.tsx';
import {AiPhotoTemplate} from '../../types/ai-photo.type.ts';
import {useCreateAiPhoto} from '../../service/hooks/ai-photo.create.hook.ts';
import {CustomAlert} from '../../components/alert/CustomAlert';

const AiPhotoMakerPage = (): JSX.Element => {
  const navigation = useNavigation<BasicNavigationProps>();
  const scrollRef = useRef<ScrollView>(null);

  const {aiPhotoTemplate, isLoading, refetch} = useAiPhotoTemplate();
  const gallery = useRecoilValue(getGallery);
  const [galleryIndex] = useRecoilState(selectedGalleryIndexState);
  const [selectedTemplateId, setSelectedTemplateId] = useState<number>();

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
      galleryId: gallery[galleryIndex].id,
      templateId: selectedTemplateId,
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
                        onSelected={(item: AiPhotoTemplate) => {
                          setSelectedTemplateId(item.id);
                        }}
                        onDeselected={(item: AiPhotoTemplate) => {
                          setSelectedTemplateId(undefined);
                        }}
                        size={90}
                        data={item}
                        selected={item.id === selectedTemplateId}
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
