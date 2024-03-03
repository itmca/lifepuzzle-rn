import React from 'react';
import {ScreenContainer} from 'react-native-screens';
import {useRecoilState} from 'recoil';
import {AuthList} from '../../constants/auth.constant';
import {writingHeroState} from '../../recoils/hero-write.recoil';
import {useAuthAxios} from '../../service/hooks/network.hook';
import {HeroUserType} from '../../types/hero.type';
import {UserType} from '../../types/user.type';
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
  selected: HeroUserType[];
  onSelect: Function;
  onSelected: Function;
  onClose: Function;
};

export const AuthItemList = ({
  user,
  selected,
  onSelect,
  onSelected,
  onClose,
}: props): JSX.Element => {
  const [writingHero, setWritingHero] = useRecoilState(writingHeroState);
  const updateAuth = (auth: string) => {
    onSelected(
      selected.map(item =>
        item.userNo === user.userNo ? {...user, auth: auth} : item,
      ),
    );
    onSelect({...user, auth: auth});
  };

  const [updateLoading, refetch] = useAuthAxios<void>({
    requestOption: {
      url: `/heroes/auth/${writingHero.heroNo}`,
      method: 'put',
    },
    onResponseSuccess: () => {
      alert('변경 완료되었습니다.');
      onClose();
    },
    onError: () => {
      CustomAlert.retryAlert('변경 실패했습니다.', onSubmit, () => {});
    },
    disableInitialRequest: true,
  });
  const onSubmit = () => {
    //onClose();
    if (!user.auth) {
      CustomAlert.simpleAlert('공유할 권한이 선택되지 않았습니다.');
      return;
    }

    refetch({
      data: {
        userNo: user.userNo,
        heroAuthStatus: user.auth,
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
          <AuthItem key={index} user={user} auth={auth} onUpdate={updateAuth} />
        ))}
      </ContentContainer>
      <CtaButton active text="저장" onPress={onSubmit} />
    </>
  );
};
