import {useNavigation} from '@react-navigation/native';

import {useRecoilState, useResetRecoilState, useSetRecoilState} from 'recoil';
import {BasicNavigationProps} from '../../../../navigation/types.tsx';
import {ContentContainer} from '../../../../components/styled/container/ContentContainer.tsx';
import {selectedTagState} from '../../../../recoils/photos.recoil.ts';
import {TagType} from '../../../../types/photo.type.ts';
import {Color} from '../../../../constants/color.constant.ts';
import {Title} from '../../../../components/styled/components/Text.tsx';
import {WritingButton} from '../Button/WritingButton.tsx';
import {SelectedStoryKeyState} from '../../../../recoils/story-view.recoil.ts';
import {
  writingStoryState,
  PostStoryKeyState,
} from '../../../../recoils/story-write.recoil.ts';
import {ButtonBase} from '../../../../components/styled/components/Button.tsx';

type props = {onPress: () => void};

const GalleryBottomButton = ({onPress}: props) => {
  const [selectedTag, setSelectedTag] =
    useRecoilState<TagType>(selectedTagState);
  if (selectedTag.key === 'AI_PHOTO') {
    return (
      <ContentContainer
        paddingHorizontal={20}
        paddingBottom={37}
        backgroundColor="transparent">
        <ButtonBase
          height={'56px'}
          width={'100%'}
          backgroundColor={Color.WHITE}
          borderColor={Color.AI_500}
          borderInside
          borderWidth={1}
          borderRadius={6}
          onPress={onPress}>
          <Title color={Color.AI_500}>작업 내역</Title>
        </ButtonBase>
      </ContentContainer>
    );
  } else {
    return (
      <ContentContainer
        paddingHorizontal={20}
        paddingBottom={37}
        backgroundColor="transparent">
        <WritingButton onPress={onPress} />
      </ContentContainer>
    );
  }
};

export default GalleryBottomButton;
