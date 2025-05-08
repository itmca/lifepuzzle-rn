import {useBottomSheetTimingConfigs} from '@gorhom/bottom-sheet';
import React, {useEffect, useMemo} from 'react';
import {ContentContainer} from '../styled/container/ContentContainer.tsx';
import {Easing} from 'react-native-reanimated';

import {useNavigation} from '@react-navigation/native';
import {useRecoilState, useRecoilValue} from 'recoil';
import {
  playInfoState,
  writingStoryState,
} from '../../recoils/story-write.recoil.ts';
import {VoicePlayer} from './StoryVoicePlayer.tsx';
import {BasicNavigationProps} from '../../navigation/types.tsx';
import BottomSheet from '../styled/components/BottomSheet.tsx';

type Props = {
  opened?: boolean;
  editable?: boolean;
  onClose?: () => void;
};

export const VoiceBottomSheet = (props: Props): JSX.Element => {
  const [writingStory, setWritingStory] = useRecoilState(writingStoryState);
  const [playInfo, setPlayInfo] = useRecoilState(playInfoState);

  const mSnapPoints = useMemo(() => ['30%'], []);

  const navigation = useNavigation<BasicNavigationProps>();
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', e => {
      if (props.opened) {
        setPlayInfo({
          isPlay: false,
          playTime: '00:00:00',
          currentPositionSec: 0,
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, [navigation]);

  //음성 재생
  useEffect(() => {
    if (props.opened) {
    } else {
      // if (!keyboardVisible) {
      //   menuModalRef.current?.present();
      //   menuModalRef.current?.snapToIndex(0);
      // }
      // setPlayInfo({
      //   isOpen: false,
      //   isPlay: false,
      //   playTime: '00:00:00',
      //   currentPositionSec: 0,
      // });
    }
  }, [props.opened]);

  return (
    <>
      <BottomSheet
        opened={props.opened}
        title={'음성메모'}
        onClose={props.onClose}
        snapPoints={mSnapPoints}>
        <ContentContainer>
          <VoicePlayer
            source={writingStory.voice}
            editable={props.editable}
            onSave={uri => {
              setWritingStory({voice: uri});
            }}
            onDelete={() => {
              setWritingStory({voice: undefined});
            }}
            onClose={props.onClose}
          />
        </ContentContainer>
      </BottomSheet>
    </>
  );
};
