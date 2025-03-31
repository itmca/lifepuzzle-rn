import React, {useState} from 'react';
import {useRecoilState} from 'recoil';
import {SortedHeroAuthTypes} from '../../constants/auth.constant';
import {writingHeroState} from '../../recoils/hero-write.recoil';
import {useAuthAxios} from '../../service/hooks/network.hook';
import {HeroUserType} from '../../types/hero.type';
import {CustomAlert} from '../alert/CustomAlert';
import CtaButton from '../button/CtaButton';
import MediumText from '../styled/components/LegacyText.tsx';
import {
  ContentContainer,
  ScrollContentContainer,
} from '../styled/container/ContentContainer';
import {AuthItem} from './AuthItem';
import {AccountAvatar} from '../avatar/AccountAvatar.tsx';
import {showToast} from '../styled/components/Toast.tsx';

type props = {
  user: HeroUserType;
  onSelect: Function;
  onClose: Function;
};

export const AuthItemList = ({user, onSelect, onClose}: props): JSX.Element => {
  const [writingHero, setWritingHero] = useRecoilState(writingHeroState);
  const [selectAuth, setselectAuth] = useState<string>(user?.auth);
  const onSelectAuth = (auth: string) => {
    setselectAuth(auth);
  };
  const [updateLoading, refetch] = useAuthAxios<void>({
    requestOption: {
      url: '/v1/heroes/auth',
      method: 'put',
    },
    onResponseSuccess: () => {
      showToast('성공적으로 저장되었습니다.');
      onSelect(selectAuth);
      onClose();
    },
    onError: () => {
      CustomAlert.retryAlert('변경 실패했습니다.', onSubmit, () => {});
    },
    disableInitialRequest: true,
  });
  const onSubmit = () => {
    //onClose();
    if (!selectAuth) {
      CustomAlert.simpleAlert('공유할 권한이 선택되지 않았습니다.');
      return;
    }

    refetch({
      data: {
        userNo: user?.userNo,
        heroNo: writingHero.heroNo,
        heroAuthStatus: selectAuth,
      },
    });
  };
  return (
    <ContentContainer>
      <ContentContainer withScreenPadding>
        {user ? (
          <ContentContainer height={'62px'} useHorizontalLayout gap={8}>
            <ContentContainer width={'60px'}>
              <AccountAvatar
                nickName={user.nickName}
                size={48}
                imageURL={user.imageURL}
              />
            </ContentContainer>
            <ContentContainer flex={1}>
              <MediumText fontWeight={'600'}>{user?.nickName}</MediumText>
            </ContentContainer>
          </ContentContainer>
        ) : (
          <></>
        )}
        <ScrollContentContainer>
          {SortedHeroAuthTypes.filter(auth => auth.code !== 'OWNER').map(
            (auth, index) => (
              <AuthItem
                key={index}
                auth={auth}
                selected={selectAuth === auth.code}
                onSelect={onSelectAuth}
              />
            ),
          )}
        </ScrollContentContainer>
        <CtaButton active text="저장" onPress={onSubmit} />
      </ContentContainer>
    </ContentContainer>
  );
};
