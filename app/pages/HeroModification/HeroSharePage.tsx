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
import {AuthList} from '../../constants/auth.constant';
import {HeroSettingRouteProps} from '../../navigation/types';
import {useAuthAxios} from '../../service/hooks/network.hook';
import DropDownPicker from 'react-native-dropdown-picker';
import Clipboard from '@react-native-clipboard/clipboard';

const HeroSharePage = (): JSX.Element => {
  const route = useRoute<HeroSettingRouteProps<'HeroShare'>>();
  const hero = route.params.hero;

  const [auth, setAuth] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const dropDownList = AuthList.map(item => {
    return {
      label: item.name,
      value: item.code,
      description: item.description,
    };
  });
  const [dropDownItem, setDropDownItem] = useState(dropDownList);

  const [updateLoading, refetch] = useAuthAxios<any>({
    requestOption: {
      url: `/heroes/auth/${hero.heroNo}/link`,
      method: 'get',
      params: {
        auth: auth,
      },
    },
    onResponseSuccess: res => {
      onCopy(res);
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
      CustomAlert.simpleAlert('클립보드에 주소가 복사되었습니다.');
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

  return (
    <ScreenContainer justifyContent={'flex-start'}>
      <LoadingContainer isLoading={updateLoading}>
        <ContentContainer padding={5}>
          <LargeTitle>{hero.heroNickName}</LargeTitle>
          <XSmallTitle fontWeight={'600'} color={Color.FONT_GRAY}>
            {hero.heroName}
          </XSmallTitle>
        </ContentContainer>
        <ContentContainer>
          <ContentContainer padding={5}>
            <XSmallTitle>권한 공유</XSmallTitle>
          </ContentContainer>
          <DropDownPicker
            open={open}
            value={auth}
            items={dropDownItem}
            setOpen={setOpen}
            setValue={setAuth}
            setItems={setDropDownItem}
            placeholder={'권한 선택'}
            renderListItem={props => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    setAuth(props.value);
                    setOpen(false);
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
