import React from 'react';

import {ContentContainer} from '../../../../components/ui/layout/ContentContainer.tsx';
import {galleryErrorState} from '../../../../recoils/content/media.recoil';
import {selectionState} from '../../../../recoils/ui/selection.recoil';
import {TagType} from '../../../../types/core/media.type';
import {Color} from '../../../../constants/color.constant.ts';
import {Title} from '../../../../components/ui/base/TextBase';
import {WritingButton} from '../Button/WritingButton.tsx';
import {ButtonBase} from '../../../../components/ui/base/ButtonBase';

type props = {onPress: () => void};

const GalleryBottomButton = ({onPress}: props) => {
  const selection = useRecoilValue(selectionState);
  const selectedTag = selection.tag;
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
