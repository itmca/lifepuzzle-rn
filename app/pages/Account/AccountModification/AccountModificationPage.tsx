import React, {useState} from 'react';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import {userState, writingUserState} from '../../recoils/user.recoil';
import {useAuthAxios} from '../../service/hooks/network.hook';
import {LoadingContainer} from '../../components/loadding/LoadingContainer';
import {CustomAlert} from '../../components/alert/CustomAlert';
import {ContentContainer} from '../../components/styled/container/ContentContainer';
import {Color} from '../../constants/color.constant';
import {TouchableOpacity} from 'react-native';
import {AccountAvatar} from '../../components/avatar/AccountAvatar.tsx';
import {
  BodyTextM,
  Caption,
  Head,
  Title,
} from '../../components/styled/components/Text.tsx';
import {ScreenContainer} from '../../components/styled/container/ScreenContainer.tsx';
import {BasicButton} from '../../components/button/BasicButton.tsx';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {useUserWithdraw} from '../../service/hooks/user.withdraw.hook.ts';
import {ProfileUpdateBottomSheet} from './components/BottomSheet/ProfileUpdateBottomSheet.tsx';
import {PasswordUpdateBottomSheet} from './components/BottomSheet/PasswordUpdateBottomSheet.tsx';

type AccountQueryResponse = {
  userNo: number;
  userId: string;
  userNickName: string;
  imageURL: string;
  recentHeroNo: number;
  userType: 'general' | 'kakao' | 'apple' | 'none';
};
const AccountModificationPage = (): JSX.Element => {
  const user = useRecoilValue(userState);

  const [profileModalOpen, setProfileModalOpen] = useState<boolean>(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState<boolean>(false);

  const setModifyingUser = useSetRecoilState(writingUserState);

  const [isUserLoading] = useAuthAxios<AccountQueryResponse>({
    requestOption: {
      url: `/v1/users/${String(user?.userNo)}`,
      method: 'GET',
    },
    onResponseSuccess: responseUser => {
      setModifyingUser({...responseUser, isProfileImageUpdate: false});
    },
    disableInitialRequest: false,
  });

  const [withdraw, isWithdrawing] = useUserWithdraw();

  return (
    <LoadingContainer isLoading={isUserLoading || isWithdrawing}>
      <ScreenContainer>
        <ContentContainer gap={8} alignCenter expandToEnd>
          <AccountAvatar imageURL={user.imageURL} size={100} />
          <ContentContainer gap={0} alignCenter>
            <Head>{user.userNickName}</Head>
            {user?.userType === 'general' && (
              <Title color={Color.GREY_500}>{user.userId}</Title>
            )}
          </ContentContainer>
        </ContentContainer>
        <ContentContainer withScreenPadding alignCenter paddingBottom={65}>
          <BasicButton
            text={'프로필 수정'}
            onPress={() => setProfileModalOpen(true)}
          />
          <ContentContainer>
            {user?.userType === 'general' && (
              <BasicButton
                text="비밀번호 변경"
                onPress={() => setPasswordModalOpen(true)}
              />
            )}
            <ContentContainer alignCenter>
              <TouchableOpacity
                onPress={() => {
                  CustomAlert.actionAlert({
                    title: '회원탈퇴',
                    desc: '기록하셨던 주인공의 이야기를 포함하여 모든 데이터가 삭제됩니다. 탈퇴하시겠습니까?',
                    actionBtnText: '탈퇴',
                    action: () => {
                      withdraw();
                    },
                  });
                }}>
                <BodyTextM color={Color.GREY_800} underline>
                  회원 탈퇴
                </BodyTextM>
              </TouchableOpacity>
            </ContentContainer>
          </ContentContainer>
          <ContentContainer
            gap={0}
            alignCenter
            absoluteBottomPosition
            paddingVertical={16}>
            <Caption color={Color.GREY_300}>designed by 박유나</Caption>
            <Caption color={Color.GREY_300}>
              developed by 오솔미 이시은 정주온 정지현
            </Caption>
          </ContentContainer>
        </ContentContainer>
        <BottomSheetModalProvider>
          <ProfileUpdateBottomSheet
            opened={profileModalOpen}
            onSuccess={() => setProfileModalOpen(false)}
            onClose={() => setProfileModalOpen(false)}
          />
          <PasswordUpdateBottomSheet
            opened={passwordModalOpen}
            onClose={() => setPasswordModalOpen(false)}
          />
        </BottomSheetModalProvider>
      </ScreenContainer>
    </LoadingContainer>
  );
};
export default AccountModificationPage;
