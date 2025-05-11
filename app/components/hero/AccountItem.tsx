import React from 'react';
import {MediumImage} from '../../components/styled/components/Image';
import {LegacyColor} from '../../constants/color.constant';
import {HeroAuthTypeByCode} from '../../constants/auth.constant';
import {ImageButton} from '../styled/components/Button';
import {MediumText, SmallText} from '../styled/components/LegacyText.tsx';
import {ContentContainer} from '../styled/container/ContentContainer';
import {HeroUserType} from '../../types/hero.type';
import {AccountAvatar} from '../avatar/AccountAvatar.tsx';

type props = {
  user: HeroUserType;
  onSelect: Function;
  allowModification: boolean;
};

export const AccountItem = ({
  user,
  onSelect,
  allowModification,
}: props): JSX.Element => {
  return (
    <ContentContainer height={'50px'} useHorizontalLayout>
      <ContentContainer width={'58px'}>
        <AccountAvatar
          nickname={user.nickName}
          size={48}
          imageURL={user.imageURL}
        />
      </ContentContainer>
      <ContentContainer flex={1} gap={4}>
        <MediumText>{user.nickName}</MediumText>
        <SmallText color={LegacyColor.FONT_GRAY}>
          {HeroAuthTypeByCode[user.auth].name}
        </SmallText>
      </ContentContainer>
      {
        // 소유자(OWNER)는 변경될 수 없다
        allowModification && (
          <ContentContainer width={'30px'}>
            <ImageButton
              width={'20px'}
              backgroundColor={'transparent'}
              onPress={() => {
                onSelect(user);
              }}>
              <MediumImage
                width={20}
                height={20}
                source={require('../../assets/images/setting.png')}
              />
            </ImageButton>
          </ContentContainer>
        )
      }
    </ContentContainer>
  );
};
