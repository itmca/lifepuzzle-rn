import React, {useState} from 'react';
import {CustomAlert} from '../../components/alert/CustomAlert';
import {
  ContentContainer,
  ScrollContentContainer,
} from '../../components/styled/container/ContentContainer';
import {SortedHeroAuthTypes} from '../../constants/auth.constant';
import {useAuthAxios} from '../../service/hooks/network.hook';
import Clipboard from '@react-native-clipboard/clipboard';
import {Radio} from '../styled/components/Radio';
import {useRecoilValue} from 'recoil';
import {heroState} from '../../recoils/hero.recoil';
import {HeroType} from '../../types/hero.type';
import {Title} from '../styled/components/Text';
import {Color} from '../../constants/color.constant';
import {ButtonBase} from '../styled/components/Button';
import {SvgIcon} from '../styled/components/SvgIcon';
import {Divider} from '../styled/components/Divider';

import {showToast} from '../styled/components/Toast.tsx';
type props = {};

export const ShareAuthList = ({}: props): JSX.Element => {
  const hero = useRecoilValue<HeroType>(heroState);
  const onSelectAuth = (auth: string) => {
    setAuth(auth);
  };
  const [auth, setAuth] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const authList = SortedHeroAuthTypes.filter(
    auth => auth.code !== 'OWNER',
  ).map(item => {
    return {
      label: item.name,
      value: item.code,
      description: item.description,
    };
  });

  const [updateLoading, refetch] = useAuthAxios<any>({
    requestOption: {
      url: `/v1/users/hero/link?heroNo=${hero?.heroNo?.toString() || '0'}&auth=${auth}`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
    },
    onResponseSuccess: ({link}) => {
      onCopy(link);
    },
    onError: error => {
      CustomAlert.retryAlert('권한 공유 실패했습니다.', onSubmit, () => {});
    },
    disableInitialRequest: true,
  });

  const onCopy = async (text: string) => {
    try {
      await Clipboard.setString(text);
      setCopied(true);
      showToast('링크가 복사되었습니다.');
    } catch (e) {
      CustomAlert.simpleAlert('복사에 실패하였습니다');
    }
  };
  const onSubmit = () => {
    if (!auth) {
      CustomAlert.simpleAlert('공유할 권한이 선택되지 않았습니다.');
      return;
    }
    refetch({});
  };

  if (!hero) {
    return <></>;
  }

  return (
    <ContentContainer gap={20}>
      <ScrollContentContainer gap={0}>
        {authList
          .filter(i => i.value !== 'OWNER')
          .map((i, index) => (
            <>
              {index !== 0 && <Divider marginVertical={0} />}
              <ContentContainer
                key={'share-auth-' + index}
                paddingVertical={14}
                gap={0}
                alignCenter>
                <Radio
                  selected={auth === i.value}
                  label={i.label}
                  value={i.value}
                  subLabel={i.description}
                  onSelect={onSelectAuth}
                />
              </ContentContainer>
            </>
          ))}
      </ScrollContentContainer>
      <ButtonBase
        height={'56px'}
        width={'100%'}
        backgroundColor={Color.TRANSPARENT}
        borderColor={Color.MAIN_DARK}
        borderRadius={6}
        borderWidth={1.5}
        onPress={onSubmit}
        borderInside>
        <SvgIcon name={'link'} size={24} />
        <Title color={Color.MAIN_DARK}>링크복사</Title>
      </ButtonBase>
    </ContentContainer>
  );
};
