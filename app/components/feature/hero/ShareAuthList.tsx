import React, { useState } from 'react';
import { CustomAlert } from '../../ui/feedback/CustomAlert';
import {
  ContentContainer,
  ScrollContentContainer,
} from '../../ui/layout/ContentContainer.tsx';
import { SortedHeroAuthTypes } from '../../../constants/auth.constant';
import { useAuthMutation } from '../../../services/core/auth-mutation.hook.ts';
import Clipboard from '@react-native-clipboard/clipboard';
import { Radio } from '../../ui/form/Radio';

import { useHeroStore } from '../../../stores/hero.store';
import { Title } from '../../ui/base/TextBase';
import { Color } from '../../../constants/color.constant';
import { ButtonBase } from '../../ui/base/ButtonBase';
import { SvgIcon } from '../../ui/display/SvgIcon';
import { Divider } from '../../ui/base/Divider';

import { showToast } from '../../ui/feedback/Toast.tsx';

type props = {};

export const ShareAuthList = ({}: props): React.ReactElement => {
  const hero = useHeroStore(state => state.currentHero);
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

  const [updateLoading, refetch] = useAuthMutation<any>({
    axiosConfig: {
      url: `/v1/users/hero/link?heroNo=${hero?.id?.toString() || '0'}&auth=${auth}`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
    },
    onSuccess: ({ link }) => {
      onCopy(link);
    },
    onError: error => {
      CustomAlert.retryAlert('권한 공유 실패했습니다.', onSubmit, () => {});
    },
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
    void refetch({});
  };

  if (!hero) {
    return <></>;
  }

  return (
    <ContentContainer gap={20}>
      <ScrollContentContainer gap={0}>
        {authList.map((i, index) => (
          <React.Fragment key={i.value}>
            {index !== 0 && <Divider marginVertical={0} />}
            <ContentContainer paddingVertical={14} gap={0} alignCenter>
              <Radio
                selected={auth === i.value}
                label={i.label}
                value={i.value}
                subLabel={i.description}
                onSelect={onSelectAuth}
              />
            </ContentContainer>
          </React.Fragment>
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
        borderInside
      >
        <SvgIcon name={'link'} size={24} />
        <Title color={Color.MAIN_DARK}>링크복사</Title>
      </ButtonBase>
    </ContentContainer>
  );
};
