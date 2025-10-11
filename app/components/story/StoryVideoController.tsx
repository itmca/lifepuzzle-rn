import React, {useEffect, useState} from 'react';
import {Dimensions, TouchableWithoutFeedback} from 'react-native';
import {Bar} from 'react-native-progress';
import {Color} from '../../constants/color.constant';
import {toMmSs} from '../../service/date-time-display.service.ts';
import {ContentContainer} from '../styled/container/ContentContainer';
import {Caption} from '../styled/components/Text.tsx';
import {SvgIcon} from '../styled/components/SvgIcon.tsx';

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

  if (!playingTime) return null;

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        setPaused(!isPaused);
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
                {isPaused ? (
                  <SvgIcon name={'playRound'} style={{zIndex: 1}}></SvgIcon>
                ) : (
                  <SvgIcon name={'pauseRound'} style={{zIndex: 1}}></SvgIcon>
                )}
              </TouchableWithoutFeedback>
            </ContentContainer>
            <ContentContainer absoluteBottomPosition gap={6} withNoBackground>
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
          </>
        )}
      </ContentContainer>
    </TouchableWithoutFeedback>
  );
};
