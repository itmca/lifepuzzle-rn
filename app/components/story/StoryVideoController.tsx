import React, {useEffect, useState} from 'react';
import {Image, TouchableWithoutFeedback} from 'react-native';
import {Bar} from 'react-native-progress';
import {Color} from '../../constants/color.constant';
import {toMinuteSeconds} from '../../service/time-display.service';
import {XSmallText} from '../styled/components/Text';
import {
  ContentContainer,
  HorizontalContentContainer,
} from '../styled/container/ContentContainer';

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
  listThumbnail,
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
    <ContentContainer
      width="100%"
      height="100%"
      position="absolute"
      alignItems="center"
      justifyContent="center"
      backgroundColor={
        isControlPadShown ? 'rgba(0, 0, 0, .3)' : 'rgba(0, 0, 0, .0)'
      }
      listThumbnail={listThumbnail ? listThumbnail : false}>
      {isControlPadShown && (
        <>
          <TouchableWithoutFeedback
            onPressIn={() => {
              isPaused ? setPaused(false) : setPaused(true);
            }}>
            <Image
              source={
                isPaused
                  ? require('../../assets/images/control_play_icon.png')
                  : require('../../assets/images/control_pause_icon.png')
              }
              style={{width: 45, height: 45}}
            />
          </TouchableWithoutFeedback>
          <ContentContainer
            position="absolute"
            gap="6px"
            bottom={2}
            padding={10}>
            <HorizontalContentContainer>
              <XSmallText color={Color.WHITE} style={{marginRight: 'auto'}}>
                {toMinuteSeconds(currentProgress * duration)}
              </XSmallText>
              <XSmallText color={Color.WHITE} style={{marginLeft: 'auto'}}>
                {playingTime}
              </XSmallText>
            </HorizontalContentContainer>
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
      <TouchableWithoutFeedback
        onPress={() => {
          isControlPadShown
            ? setIsControlPadShown(false)
            : setIsControlPadShown(true);
          isPaused && isControlPadShown ? setClicked(false) : null;
        }}>
        <ContentContainer
          height="100%"
          position="absolute"
          zIndex={-1}
          opacity={0}
        />
      </TouchableWithoutFeedback>
    </ContentContainer>
  );
};
