import React from 'react';
import { ActivityIndicator } from 'react-native';
import { Color } from '../../../../../constants/color.constant.ts';
import { ButtonBase } from '../../../../../components/ui/base/ButtonBase';
import {
  IconName,
  SvgIcon,
} from '../../../../../components/ui/display/SvgIcon.tsx';
import { ContentContainer } from '../../../../../components/ui/layout/ContentContainer';

type ButtonType = 'record' | 'stop' | 'pause' | 'play' | 'check' | 'delete';

type BaseProps = {
  visiable?: boolean;
  onPress: () => void;
};

type VoiceControlButtonProps = BaseProps & {
  type: ButtonType;
  disabled?: boolean;
  loading?: boolean;
};

/**
 * 버튼 타입별 설정
 */
const BUTTON_CONFIG: Record<
  ButtonType,
  {
    icon: IconName;
    size: number;
    height: number;
    getColor: (disabled?: boolean) => string;
  }
> = {
  record: {
    icon: 'recordRound',
    size: 64,
    height: 64,
    getColor: () => Color.MAIN_DARK,
  },
  stop: {
    icon: 'stopRound',
    size: 64,
    height: 64,
    getColor: () => Color.MAIN_DARK,
  },
  pause: {
    icon: 'pauseRound',
    size: 64,
    height: 64,
    getColor: () => Color.MAIN_DARK,
  },
  play: {
    icon: 'playRound',
    size: 64,
    height: 64,
    getColor: () => Color.MAIN_DARK,
  },
  check: {
    icon: 'checkRound',
    size: 40,
    height: 40,
    getColor: disabled => (disabled ? Color.GREY_300 : Color.MAIN_DARK),
  },
  delete: {
    icon: 'deleteRound',
    size: 40,
    height: 40,
    getColor: () => Color.MAIN_DARK,
  },
};

/**
 * 음성 컨트롤 버튼 (통합 버전)
 *
 * @description
 * 음성 녹음/재생 관련 모든 버튼을 하나의 컴포넌트로 통합
 * type prop으로 버튼 종류 결정
 *
 * @example
 * <VoiceControlButton type="record" onPress={startRecord} />
 * <VoiceControlButton type="check" onPress={onSave} disabled={isUploading} />
 */
export const VoiceControlButton = ({
  type,
  visiable = true,
  onPress,
  disabled,
  loading,
}: VoiceControlButtonProps): React.ReactElement => {
  const config = BUTTON_CONFIG[type];

  // check, delete 버튼은 visiable=false일 때 공간만 차지
  if (!visiable && (type === 'check' || type === 'delete')) {
    return <ContentContainer width={40} />;
  }

  const iconColor = config.getColor(disabled);

  return (
    <ButtonBase
      height={`${config.height}px`}
      width={'auto'}
      style={
        type === 'check' || type === 'delete'
          ? { alignSelf: 'center' }
          : undefined
      }
      backgroundColor={Color.TRANSPARENT}
      borderRadius={config.height}
      onPress={onPress}
      borderInside
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator size="large" color={Color.MAIN_DARK} />
      ) : (
        <SvgIcon name={config.icon} color={iconColor} size={config.size} />
      )}
    </ButtonBase>
  );
};

/**
 * 개별 버튼 컴포넌트들 (하위 호환성 유지)
 *
 * @description
 * 기존 코드와의 호환성을 위해 개별 컴포넌트로도 export
 * 내부적으로는 VoiceControlButton을 사용
 */

export const RecordButton = ({
  visiable = true,
  onPress,
}: BaseProps): React.ReactElement => {
  return (
    <VoiceControlButton type="record" visiable={visiable} onPress={onPress} />
  );
};

export const StopButton = ({ onPress }: BaseProps): React.ReactElement => {
  return <VoiceControlButton type="stop" onPress={onPress} />;
};

export const PauseButton = ({ onPress }: BaseProps): React.ReactElement => {
  return <VoiceControlButton type="pause" onPress={onPress} />;
};

type PlayButtonProps = BaseProps & {
  loading?: boolean;
};

export const PlayButton = ({
  onPress,
  loading,
}: PlayButtonProps): React.ReactElement => {
  return <VoiceControlButton type="play" onPress={onPress} loading={loading} />;
};

type CheckButtonProps = BaseProps & {
  disabled?: boolean;
  loading?: boolean;
};

export const CheckButton = ({
  onPress,
  visiable,
  disabled,
  loading,
}: CheckButtonProps): React.ReactElement => {
  return (
    <VoiceControlButton
      type="check"
      visiable={visiable}
      onPress={onPress}
      disabled={disabled}
      loading={loading}
    />
  );
};

export const DeleteButton = ({
  onPress,
  visiable,
}: BaseProps): React.ReactElement => {
  return (
    <VoiceControlButton type="delete" visiable={visiable} onPress={onPress} />
  );
};
