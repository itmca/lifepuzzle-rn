import React from 'react';
import {Avatar} from 'react-native-paper';
import {StyleProp, TouchableOpacity} from 'react-native';
import {Color} from '../../../constants/color.constant.ts';
import {ContentContainer} from '../layout/ContentContainer';
import {SvgIcon} from './SvgIcon.tsx';
import {HeroAuthTypeCode} from '../../../constants/auth.constant.ts';

type Props = {
  imageURL: string | undefined;
  size: number;
  style?: StyleProp<any> | undefined;
  editable?: boolean;
  onEditPress?: () => void;
  auth?: HeroAuthTypeCode;
  iconSize?: number;
  iconPadding?: number;
};

export const AccountAvatar = ({
  imageURL,
  size,
  style,
  editable = false,
  onEditPress,
  auth,
  iconSize = 24,
  iconPadding = 0,
}: Props): JSX.Element => {
  return (
    <TouchableOpacity
      disabled={!editable}
      onPress={() => {
        if (editable) {
          onEditPress?.();
        }
      }}>
      <ContentContainer width={'auto'} alignCenter>
        {imageURL ? (
          <Avatar.Image
            style={{backgroundColor: Color.GREY, ...style}}
            size={size}
            source={{uri: imageURL}}
          />
        ) : (
          <SvgIcon name="profile" size={size} />
        )}
        {editable && (
          <ContentContainer
            width={'auto'}
            absoluteBottomPosition
            absoluteRightPosition
            paddingBottom={iconPadding}
            paddingRight={iconPadding}
            withNoBackground
            alignCenter>
            <SvgIcon name="cameraCircleSmall" size={iconSize} />
          </ContentContainer>
        )}
        {(auth === 'OWNER' || auth === 'ADMIN') && (
          <ContentContainer
            width={'auto'}
            absoluteTopPosition
            absoluteRightPosition
            paddingTop={iconPadding}
            paddingRight={iconPadding}
            withNoBackground
            alignCenter>
            <SvgIcon
              name={auth === 'OWNER' ? 'owner' : 'manager'}
              size={iconSize}
            />
          </ContentContainer>
        )}
      </ContentContainer>
    </TouchableOpacity>
  );
};
