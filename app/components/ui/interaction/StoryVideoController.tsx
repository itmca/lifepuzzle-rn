import React, { useEffect, useState } from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Bar } from 'react-native-progress';
import { Color } from '../../../constants/color.constant';
import { toMmSs } from '../../../utils/time-formatter.util.ts';
import { ContentContainer } from '../layout/ContentContainer';
import { CaptionB } from '../base/TextBase';
import { SvgIcon } from '../display/SvgIcon.tsx';

type Props = {
  width: number;
  duration: number;
  playingTime: string;
  isPaused: boolean;
  currentProgress: number;
  listThumbnail?: boolean;
  handleProgress: (e: { nativeEvent: { pageX: number } }) => void;
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
  const insets = useSafeAreaInsets();
  useEffect(() => {
    if (isPaused === undefined) {
      return;
    }

    setControlPadShown(isPaused);
    onVisibleChanged(isPaused);
  }, [isPaused]);

  if (!playingTime) {
    return null;
  }

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        setPaused(!isPaused);
      }}
    >
      <ContentContainer
        absoluteTopPosition
        gap={0}
        alignCenter
        width="100%"
        height="100%"
        backgroundColor={
          isControlPadShown ? 'rgba(0, 0, 0, .4)' : 'rgba(0, 0, 0, .0)'
        }
      >
        {isControlPadShown && (
          <>
            <ContentContainer alignCenter height={'100%'} withNoBackground>
              <TouchableWithoutFeedback
                onPressIn={() => {
                  setPaused(!isPaused);
                }}
              >
                {isPaused ? (
                  <SvgIcon name={'playRound'} />
                ) : (
                  <SvgIcon name={'pauseRound'} />
                )}
              </TouchableWithoutFeedback>
            </ContentContainer>
            <ContentContainer
              absoluteBottomPosition
              gap={6}
              withNoBackground
              paddingBottom={insets.bottom + 8}
            >
              <ContentContainer
                useHorizontalLayout
                withNoBackground
                paddingHorizontal={4}
              >
                <CaptionB color={Color.WHITE}>
                  {toMmSs(currentProgress * duration)}
                </CaptionB>
                <CaptionB color={Color.WHITE}>{playingTime}</CaptionB>
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
