import React, {useEffect, useState} from 'react';
import {TouchableOpacity} from 'react-native';
import {Photo} from '../styled/components/Image';
import {Color} from '../../constants/color.constant';
import {ContentContainer} from '../styled/container/ContentContainer';
import {AiPhotoTemplate} from '../../types/ai-photo.type';
import {VideoPlayer} from '../story/StoryVideoPlayer';
import {SvgIcon} from '../styled/components/SvgIcon';
import {useVideoThumbnail} from '../../service/hooks/ai-photo.query.hook';

type SelectableAiPhotoTemplateProps = {
  onSelected: Function;
  onDeselected: Function;
  size: number;
  data: AiPhotoTemplate;
  selected?: boolean;
};

const SelectableAiPhotoTemplate = ({
  onSelected,
  onDeselected,
  size,
  data,
  selected = false,
}: SelectableAiPhotoTemplateProps): JSX.Element => {
  const [thumbnailUri, setThumbnailUri] = useState<string | null>(null);
  const {generateThumbnail, isLoading} = useVideoThumbnail();

  useEffect(() => {
    const loadThumbnail = async () => {
      const thumbnail = await generateThumbnail(data.uri);
      setThumbnailUri(thumbnail);
    };

    if (data.uri) {
      loadThumbnail();
    }
  }, [data.uri, generateThumbnail]);

  const _onPress = () => {
    selected === true ? onDeselected(data) : onSelected(data);
  };

  return (
    <TouchableOpacity onPress={_onPress}>
      <ContentContainer
        width={size}
        height={size}
        withBorder={selected}
        backgroundColor={Color.GREY_700}
        borderRadius={6}
        borderColor={Color.AI_500}
        style={{borderWidth: selected ? 4 : 0}}>
        {selected ? (
          <VideoPlayer
            videoUrl={data.uri}
            width={size}
            activeMediaIndexNo={selected ? 1 : 0}
            setPaginationShown={() => {}}
          />
        ) : (
          <>
            {thumbnailUri ? (
              <Photo
                width={size}
                resizeMode={'contain'}
                source={{uri: thumbnailUri}}
              />
            ) : (
              <ContentContainer width={size} />
            )}
            <ContentContainer
              width={'auto'}
              absoluteBottomPosition
              absoluteRightPosition
              paddingBottom={8}
              paddingRight={8}
              withNoBackground>
              <SvgIcon name={'previewPlay'} size={24} />
            </ContentContainer>
          </>
        )}
      </ContentContainer>
    </TouchableOpacity>
  );
};

export default SelectableAiPhotoTemplate;
