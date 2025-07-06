import React, {useEffect, useMemo, useRef} from 'react';
import {ContentContainer} from '../styled/container/ContentContainer.tsx';

import {useNavigation} from '@react-navigation/native';
import {useRecoilState} from 'recoil';
import {writingStoryState} from '../../recoils/story-write.recoil.ts';
import {VoicePlayer, VoicePlayerRef} from './StoryVoicePlayer.tsx';
import {BasicNavigationProps} from '../../navigation/types.tsx';
import BottomSheet from '../styled/components/BottomSheet.tsx';

type Props = {
  opened?: boolean;
  editable?: boolean;
  onClose?: () => void;
};

export const VoiceBottomSheet = (props: Props): JSX.Element => {
  const voicePlayerRef = useRef<VoicePlayerRef>(null);
  const [writingStory, setWritingStory] = useRecoilState(writingStoryState);
  const navigation = useNavigation<BasicNavigationProps>();
  const mSnapPoints = useMemo(() => ['30%'], []);

  const handleClose = () => {
    voicePlayerRef.current?.stopAllAudio?.();
    props.onClose && props.onClose();
  };
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', e => {
      if (props.opened) {
        voicePlayerRef.current?.stopAllAudio?.();
      }
    });

    return () => {
      unsubscribe();
    };
  }, [navigation, props.opened]);

  //음성 재생
  useEffect(() => {
    if (!props.opened) {
      handleClose();
    }
  }, [props.opened]);

  return (
    <>
      <BottomSheet
        opened={props.opened}
        title={'음성메모'}
        onClose={handleClose}
        snapPoints={mSnapPoints}>
        <ContentContainer>
          <VoicePlayer
            ref={voicePlayerRef}
            source={writingStory.voice}
            editable={props.editable}
            onSave={uri => {
              setWritingStory({voice: uri});
            }}
            onDelete={() => {
              setWritingStory({voice: undefined});
            }}
            onClose={handleClose}
          />
        </ContentContainer>
      </BottomSheet>
    </>
  );
};
