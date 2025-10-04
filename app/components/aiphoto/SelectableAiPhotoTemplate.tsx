import React, {useEffect, useRef, useState} from 'react';
import {TouchableOpacity} from 'react-native';
import Video from 'react-native-video';
import {useNavigation} from '@react-navigation/native';
import {ContentContainer} from '../styled/container/ContentContainer';
import {SvgIcon} from '../styled/components/SvgIcon';
import {Color} from '../../constants/color.constant';
import {BasicNavigationProps} from '../../navigation/types';
import {AiPhotoTemplate} from '../../types/ai-photo.type';

type SelectableAiPhotoTemplateProps = {
  onSelected: Function;
  onDeselected: Function;
  size: number;
  data: AiPhotoTemplate;
  selected: boolean;
};

const SelectableAiPhotoTemplate = ({
  onSelected,
  onDeselected,
  size,
  data,
  selected,
}: SelectableAiPhotoTemplateProps): JSX.Element => {
  const player = useRef<any>(null);
  const [paused, setPaused] = useState<boolean>(true);

  const _onPress = () => {
    selected === true ? onDeselected(data) : onSelected(data);
  };

  useEffect(() => {
    if (selected) {
      // 선택될 때 처음부터 재생
      setTimeout(() => {
        if (player.current) {
          player.current.seek(0);
        }
        setPaused(false);
      }, 100);
    } else {
      setPaused(true);
    }
  }, [selected]);

  const navigation = useNavigation<BasicNavigationProps>();

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
          repeat={true}
          playInBackground={false}
          playWhenInactive={false}
          ignoreSilentSwitch="ignore"
          mixWithOthers="mix"
          onError={error => {
            setPaused(true);
          }}
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
