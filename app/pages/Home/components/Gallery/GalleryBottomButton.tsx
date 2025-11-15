import React from 'react';
import {useRecoilState, useRecoilValue} from 'recoil';
import {ContentContainer} from '../../../../components/ui/layout/ContentContainer.tsx';
import {
  galleryErrorState,
  selectedTagState,
} from '../../../../recoils/content/media.recoil.ts';
import {TagType} from '../../../../types/photo.type.ts';
import {Color} from '../../../../constants/color.constant.ts';
import {Title} from '../../../../components/ui/base/TextBase';
import {WritingButton} from '../Button/WritingButton.tsx';
import {ButtonBase} from '../../../../components/ui/base/ButtonBase';

type props = {onPress: () => void};

const GalleryBottomButton = ({onPress}: props) => {
  const [selectedTag] = useRecoilState<TagType>(selectedTagState);
  const isGalleryError = useRecoilValue(galleryErrorState);
  if (selectedTag?.key === 'AI_PHOTO') {
    return (
      <ContentContainer
        paddingHorizontal={20}
        paddingBottom={37}
        backgroundColor="transparent">
        <ButtonBase
          height={'56px'}
          width={'100%'}
          backgroundColor={isGalleryError ? Color.GREY_100 : Color.WHITE}
          borderColor={isGalleryError ? Color.GREY_200 : Color.AI_500}
          borderInside
          borderWidth={1}
          borderRadius={6}
          onPress={isGalleryError ? undefined : onPress}>
          <Title color={isGalleryError ? Color.GREY_300 : Color.AI_500}>
            작업 내역
          </Title>
        </ButtonBase>
      </ContentContainer>
    );
  } else {
    return (
      <ContentContainer
        paddingHorizontal={20}
        paddingBottom={37}
        backgroundColor="transparent">
        <WritingButton onPress={onPress} disabled={isGalleryError} />
      </ContentContainer>
    );
  }
};

export default GalleryBottomButton;
