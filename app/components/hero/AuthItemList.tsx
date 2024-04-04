import React, {useState} from 'react';
import {useRecoilState} from 'recoil';
import {AuthList} from '../../constants/auth.constant';
import {writingHeroState} from '../../recoils/hero-write.recoil';
import {useAuthAxios} from '../../service/hooks/network.hook';
import {HeroUserType} from '../../types/hero.type';
import {CustomAlert} from '../alert/CustomAlert';
import CtaButton from '../button/CtaButton';
import {MediumImage} from '../styled/components/Image';
import MediumText from '../styled/components/Text';

import {
  ContentContainer,
  HorizontalContentContainer,
} from '../styled/container/ContentContainer';
import {AuthItem} from './AuthItem';

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
      url: `/heroes/auth/${writingHero.heroNo}`,
      method: 'put',
    },
    onResponseSuccess: () => {
      CustomAlert.simpleAlert('변경 완료되었습니다.');
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
        heroAuthStatus: selectAuth,
      },
    });
  };
  return (
    <>
      <ContentContainer>
        {user ? (
          <HorizontalContentContainer height={'62px'}>
            <ContentContainer width={'60px'}>
              <MediumImage
                width={48}
                height={48}
                resizeMode={'contain'}
                source={
                  user?.imageURL ??
                  require('../../assets/images/profile_icon.png')
                }
              />
            </ContentContainer>
            <ContentContainer flex={1}>
              <MediumText fontWeight={'600'}>{user?.nickName}</MediumText>
            </ContentContainer>
          </HorizontalContentContainer>
        ) : (
          <></>
        )}
        {AuthList.map((auth, index) => (
          <AuthItem
            key={index}
            auth={auth}
            selected={selectAuth == auth.code}
            onSelect={onSelectAuth}
          />
        ))}
      </ContentContainer>
      <CtaButton active text="저장" onPress={onSubmit} />
    </>
  );
};
