import React from 'react';
import {Avatar} from 'react-native-paper';
import {StyleProp} from 'react-native';
import {Color, LegacyColor} from '../../constants/color.constant.ts';
import {ContentContainer} from '../styled/container/ContentContainer.tsx';
import {SvgIcon} from '../styled/components/SvgIcon.tsx';

type Props = {
  imageURL: string | undefined;
  size: number;
  style?: StyleProp<any> | undefined;
  nickname: string;
  editable?: boolean;
};

export const AccountAvatar = ({
  nickname,
  imageURL,
  size,
  style,
  editable = false,
}: Props): JSX.Element => {
  if (!imageURL) {
    return (
      <ContentContainer width={'auto'} alignCenter>
        <Avatar.Text
          style={{backgroundColor: Color.GREY, ...style}}
          size={size}
          label={nickname[0]}
        />
        {editable && (
          <ContentContainer
            width={'auto'}
            absoluteBottomPosition
            absoluteRightPosition
            paddingBottom={2}
            paddingRight={2}
            withNoBackground
            alignCenter>
            <SvgIcon name="cameraCircleSmall" size={24} />
          </ContentContainer>
        )}
      </ContentContainer>
    );
  }

  return (
    <ContentContainer width={'auto'} alignCenter>
      <Avatar.Image
        style={{backgroundColor: Color.GREY, ...style}}
        size={size}
        source={{uri: imageURL}}
      />
      {editable && (
        <ContentContainer
          width={'auto'}
          absoluteBottomPosition
          absoluteRightPosition
          paddingBottom={2}
          paddingRight={2}
          withNoBackground
          alignCenter>
          <SvgIcon name="cameraCircleSmall" size={24} />
        </ContentContainer>
      )}
    </ContentContainer>
  );
};
