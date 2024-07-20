import React, {useEffect, useState} from 'react';
import {Image, TouchableWithoutFeedback} from 'react-native';
import {Bar} from 'react-native-progress';
import {Color} from '../../constants/color.constant';
import {toMinuteSeconds} from '../../service/time-display.service';
import {XXSmallText} from '../styled/components/Text';
import {ContentContainer} from '../styled/container/ContentContainer';

type Props = {
  width: number;
  duration: number;
  playingTime: string;
  isPaused: boolean;
  currentProgress: number;
  listThumbnail?: boolean;
  isClicked: boolean;
  handleProgress: (e: {nativeEvent: {pageX: number}}) => void;
  setPaused: (data: boolean) => void;
  setClicked: (data: boolean) => void;
};

export const VideoController = ({
  width,
  duration,
  playingTime,
  currentProgress,
  isPaused,
  isClicked,
  setPaused,
  setClicked,
  handleProgress,
}: Props) => {
  const [isControlPadShown, setIsControlPadShown] = useState<boolean>(false);

  useEffect(() => {
    setIsControlPadShown(isClicked);
  }, [isClicked]);

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        isControlPadShown
          ? setIsControlPadShown(false)
          : setIsControlPadShown(true);
        isPaused && isControlPadShown ? setClicked(false) : null;
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
            <ContentContainer absoluteBottomPosition gap={6} withNoBackground>
              <ContentContainer
                useHorizontalLayout
                withNoBackground
                paddingHorizontal={4}>
                <XXSmallText color={Color.WHITE}>
                  {toMinuteSeconds(currentProgress * duration)}
                </XXSmallText>
                <XXSmallText color={Color.WHITE}>{playingTime}</XXSmallText>
              </ContentContainer>
              <TouchableWithoutFeedback onPress={handleProgress}>
                <Bar
                  progress={currentProgress}
                  width={width}
                  height={4}
                  color={Color.PRIMARY_LIGHT}
                  unfilledColor={Color.WHITE}
                  borderColor={Color.GRAY}
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
