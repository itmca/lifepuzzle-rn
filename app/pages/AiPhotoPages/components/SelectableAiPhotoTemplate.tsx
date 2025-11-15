import React, {useEffect, useRef, useState} from 'react';
import {TouchableOpacity} from 'react-native';
import Video from 'react-native-video';
import {useNavigation} from '@react-navigation/native';
import {ContentContainer} from '../../../components/ui/layout/ContentContainer.tsx';
import {SvgIcon} from '../../../components/ui/display/SvgIcon';
import {Color} from '../../../constants/color.constant';
import {BasicNavigationProps} from '../../../navigation/types';
import {AiPhotoTemplate} from '../../../types/external/ai-photo.type';
import {Photo} from '../../../components/ui/base/ImageBase';

type SelectableAiPhotoTemplateProps = {
  onSelected: (item: AiPhotoTemplate) => void;
  size: number;
  data: AiPhotoTemplate;
  selected: boolean;
};

const SelectableAiPhotoTemplate = ({
  onSelected,
  size,
  data,
  selected,
}: SelectableAiPhotoTemplateProps): JSX.Element => {
  const navigation = useNavigation<BasicNavigationProps>();
  const player = useRef<any>(null);
  const [paused, setPaused] = useState<boolean>(true);

  const _onPress = () => {
    if (!selected) {
      onSelected(data);
    }

    if (paused) {
      setTimeout(() => {
        if (player.current) {
          player.current.seek(0);
        }
        setPaused(false);
      }, 100);
    }
  };

  useEffect(() => {
    if (!selected) {
      setPaused(true);
    }
  }, [selected]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', e => {
      setPaused(true);
    });

    return () => {
      unsubscribe();
    };
  }, [navigation]);

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
        {selected || (
          <ContentContainer absoluteTopPosition height={'100%'} zIndex={1}>
            <Photo source={{uri: data.thumbnailUrl}} />
          </ContentContainer>
        )}
        <Video
          key={`${data.id}-${data.url}`}
          ref={player}
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: Color.BLACK,
          }}
          source={{uri: data.url}}
          paused={paused}
          resizeMode={'contain'}
          fullscreen={false}
          controls={false}
          muted={false}
          repeat={false}
          playInBackground={false}
          playWhenInactive={false}
          ignoreSilentSwitch="ignore"
          mixWithOthers="mix"
          onEnd={() => setPaused(true)}
          onError={() => setPaused(true)}
        />
        <ContentContainer
          absoluteTopPosition
          width="100%"
          height="100%"
          withNoBackground
        />
        <ContentContainer
          width={'auto'}
          absoluteBottomPosition
          absoluteRightPosition
          paddingBottom={8}
          paddingRight={8}
          withNoBackground>
          {paused && <SvgIcon name={'previewPlay'} size={24} />}
        </ContentContainer>
      </ContentContainer>
    </TouchableOpacity>
  );
};

export default SelectableAiPhotoTemplate;
