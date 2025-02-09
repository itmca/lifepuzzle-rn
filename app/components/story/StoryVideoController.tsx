import React, {useEffect, useState} from 'react';
import {Image, TouchableWithoutFeedback} from 'react-native';
import {Bar} from 'react-native-progress';
import {LegacyColor} from '../../constants/color.constant';
import {toMinuteSeconds} from '../../service/date-time-display.service.ts';
import {XXSmallText} from '../styled/components/LegacyText.tsx';
import {ContentContainer} from '../styled/container/ContentContainer';

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
                      ? require('../../assets/images/control_play_icon.png')
                      : require('../../assets/images/control_pause_icon.png')
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
                    <XXSmallText color={LegacyColor.WHITE}>
                      {toMinuteSeconds(currentProgress * duration)}
                    </XXSmallText>
                    <XXSmallText color={LegacyColor.WHITE}>
                      {playingTime}
                    </XXSmallText>
                  </ContentContainer>
                )}
                <TouchableWithoutFeedback onPress={handleProgress}>
                  <Bar
                    progress={currentProgress}
                    width={width}
                    height={4}
                    color={LegacyColor.PRIMARY_LIGHT}
                    unfilledColor={LegacyColor.WHITE}
                    borderColor={LegacyColor.GRAY}
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
