import {useRoute} from '@react-navigation/native';
import React, {useState} from 'react';
import {TouchableOpacity} from 'react-native';
import {CustomAlert} from '../../components/alert/CustomAlert';
import CtaButton from '../../components/button/CtaButton';
import {LoadingContainer} from '../../components/loadding/LoadingContainer';
import {
  LargeTitle,
  XSmallTitle,
} from '../../components/styled/components/Title';
import {XSmallText} from '../../components/styled/components/Text';
import {
  ContentContainer,
  HorizontalContentContainer,
} from '../../components/styled/container/ContentContainer';
import {ScreenContainer} from '../../components/styled/container/ScreenContainer';
import {Color} from '../../constants/color.constant';
import {RoleList} from '../../constants/role.constant';
import {HeroSettingRouteProps} from '../../navigation/types';
import {useAuthAxios} from '../../service/hooks/network.hook';
import {HeroType, ShareType} from '../../types/hero.type';
import DropDownPicker from 'react-native-dropdown-picker';
import Clipboard from '@react-native-clipboard/clipboard';

const HeroSharePage = (): JSX.Element => {
  const route = useRoute<HeroSettingRouteProps<'HeroShare'>>();
  const heroNo = route.params.heroNo;
  const [name, setName] = useState<string>('');
  const [nickName, setNickName] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [loading] = useAuthAxios<HeroType>({
    requestOption: {
      url: `/heroes/${heroNo}`,
      method: 'get',
    },
    onResponseSuccess: hero => {
      setName(hero.heroName);
      setNickName(hero.heroNickName);
    },
    disableInitialRequest: false,
  });
  const [updateLoading, refetch] = useAuthAxios<ShareType>({
    requestOption: {
      url: `/heroes/${heroNo}`,
      method: 'get',
    },
    onResponseSuccess: share => {
      onCopy(share.shareURL);
    },
    onError: () => {
      CustomAlert.retryAlert('권한 공유 실패했습니다.', onSubmit, () => {});
    },
    disableInitialRequest: true,
  });
  const onCopy = async (text: string) => {
    try {
      await Clipboard.setString(text);
      setCopied(true);
      alert('클립보드에 주소가 복사되었습니다.');
    } catch (e) {
      alert('복사에 실패하였습니다');
    }
  };
  const addShareInFormData = (formData: FormData) => {
    const share: ShareType = {
      heroNo: heroNo,
      role: role,
      shareURL: '',
    };
    formData.append('toUpdate', {
      string: JSON.stringify(share),
      type: 'application/json',
    });
  };
  const onSubmit = () => {
    if (!role) {
      CustomAlert.simpleAlert('공유할 권한이 선택되지 않았습니다.');
      return;
    }

    const formData = new FormData();

    addShareInFormData(formData);
    refetch({data: formData});
  };

  let dropDownItem = RoleList.map(item => {
    return {
      label: item.name,
      value: item.code,
      description: item.description,
    };
  });
  const [role, setRole] = useState<string>('');
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState(dropDownItem);
  return (
    <ScreenContainer justifyContent={'flex-start'}>
      <LoadingContainer isLoading={loading || updateLoading}>
        <ContentContainer padding={5}>
          <LargeTitle>{nickName}</LargeTitle>
          <XSmallTitle fontWeight={'600'} color={Color.FONT_GRAY}>
            {name}
          </XSmallTitle>
        </ContentContainer>
        <ContentContainer>
          <ContentContainer padding={5}>
            <XSmallTitle>권한 공유</XSmallTitle>
          </ContentContainer>
          <DropDownPicker
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            placeholder={'권한 선택'}
            renderListItem={props => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    setValue(props.value);
                    setOpen(false);
                    setRole(props.value);
                    setCopied(false);
                  }}>
                  <HorizontalContentContainer>
                    <ContentContainer padding={11}>
                      <XSmallTitle>{props.item.label}</XSmallTitle>
                      <XSmallText color={Color.DARK_GRAY}>
                        {props.item.description}
                      </XSmallText>
                    </ContentContainer>
                  </HorizontalContentContainer>
                </TouchableOpacity>
              );
            }}
          />
          <ContentContainer marginTop={'20px'}>
            <CtaButton
              active
              disabled={copied}
              text={copied ? 'Copied' : '공유하기'}
              onPress={onSubmit}
            />
          </ContentContainer>
        </ContentContainer>
      </LoadingContainer>
    </ScreenContainer>
  );
};
export default HeroSharePage;
