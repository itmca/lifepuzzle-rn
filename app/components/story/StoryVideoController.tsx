import React, {useEffect, useState} from 'react';
import {Image, TouchableWithoutFeedback} from 'react-native';
import {Bar} from 'react-native-progress';
import {Color} from '../../constants/color.constant';
import {toMmSs} from '../../service/date-time-display.service.ts';
import {ContentContainer} from '../styled/container/ContentContainer';
import {Caption} from '../styled/components/Text.tsx';

type Props = {
  width: number;
  duration: number;
  playingTime: string;
  isPaused: boolean;
  currentProgress: number;
  listThumbnail?: boolean;
  handleProgress: (e: {nativeEvent: {pageX: number}}) => void;
  setPaused: (data: boolean) => void;
  onVisibleChanged: (data: boolean) => void;
};

export const VideoController = ({
  width,
  duration,
  playingTime,
  currentProgress,
  isPaused,
  setPaused,
  onVisibleChanged,
  handleProgress,
}: Props) => {
  const [isControlPadShown, setControlPadShown] = useState<boolean>(true);

  useEffect(() => {
    if (isPaused === undefined) {
      return;
    }

    setControlPadShown(isPaused);
    onVisibleChanged(isPaused);
  }, [isPaused]);

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        if (isControlPadShown === undefined || isPaused) {
          return;
        }
        setControlPadShown(!isControlPadShown);
      }}>
      <ContentContainer
        absoluteTopPosition
        gap={0}
        alignCenter
        width="100%"
        height="100%"
        backgroundColor={
          isControlPadShown ? 'rgba(0, 0, 0, .4)' : 'rgba(0, 0, 0, .0)'
        }>
        {isControlPadShown && (
          <>
            <ContentContainer alignCenter height={'100%'} withNoBackground>
              <TouchableWithoutFeedback
                onPressIn={() => {
                  setPaused(!isPaused);
                }}>
                <Image
                  source={
                    isPaused
                      ? require('../../assets/icons/play_round.svg')
                      : require('../../assets/icons/pause_round.svg')
                  }
                  style={{width: 45, height: 45, zIndex: 1}}
                />
              </TouchableWithoutFeedback>
            </ContentContainer>
            {currentProgress > 0.01 && (
              <ContentContainer absoluteBottomPosition gap={6} withNoBackground>
                {!isPaused && (
                  <ContentContainer
                    useHorizontalLayout
                    withNoBackground
                    paddingHorizontal={4}>
                    <Caption fontSize={10} color={Color.WHITE}>
                      {toMmSs(currentProgress * duration)}
                    </Caption>
                    <Caption fontSize={10} color={Color.WHITE}>
                      {playingTime}
                    </Caption>
                  </ContentContainer>
                )}
                <TouchableWithoutFeedback onPress={handleProgress}>
                  <Bar
                    progress={currentProgress}
                    width={width}
                    height={4}
                    color={Color.MAIN_DARK}
                    unfilledColor={Color.WHITE}
                    borderColor={Color.GREY_100}
                    borderRadius={50}
                    borderWidth={0}
                  />
                </TouchableWithoutFeedback>
              </ContentContainer>
            )}
          </>
        )}
      </ContentContainer>
    </TouchableWithoutFeedback>
  );
};
