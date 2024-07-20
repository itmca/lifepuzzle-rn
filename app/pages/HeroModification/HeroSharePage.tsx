import {useRoute} from '@react-navigation/native';
import React, {useState} from 'react';
import {CustomAlert} from '../../components/alert/CustomAlert';
import CtaButton from '../../components/button/CtaButton';
import {LoadingContainer} from '../../components/loadding/LoadingContainer';
import {
  LargeTitle,
  XSmallTitle,
} from '../../components/styled/components/Title';
import {XSmallText} from '../../components/styled/components/Text';
import {ContentContainer} from '../../components/styled/container/ContentContainer';
import {ScreenContainer} from '../../components/styled/container/ScreenContainer';
import {Color} from '../../constants/color.constant';
import {AuthList} from '../../constants/auth.constant';
import {HeroSettingRouteProps} from '../../navigation/types';
import {useAuthAxios} from '../../service/hooks/network.hook';
import Clipboard from '@react-native-clipboard/clipboard';
import SelectDropdown from 'react-native-select-dropdown';
import {SmallImage} from '../../components/styled/components/Image';
import {styles} from './styles';

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
        <ContentContainer withScreenPadding>
          <ContentContainer padding={5}>
            <LargeTitle>{hero.heroNickName}</LargeTitle>
            <XSmallTitle fontWeight={'600'} color={Color.FONT_GRAY}>
              {hero.heroName}
            </XSmallTitle>
          </ContentContainer>
          <ContentContainer>
            <ContentContainer padding={12}>
              <XSmallTitle>권한 공유</XSmallTitle>
            </ContentContainer>
            <SelectDropdown
              data={dropDownItem}
              onSelect={(selectedItem, index) => {
                setAuth(selectedItem.value);
                setOpen(false);
                setCopied(false);
              }}
              renderButton={(selectedItem, isOpened) => {
                return (
                  <ContentContainer withContentPadding style={styles.dropdown}>
                    <ContentContainer flex={1} gap={8}>
                      <XSmallTitle>
                        {(selectedItem && selectedItem.label) || '권한 선택'}
                      </XSmallTitle>
                      {selectedItem && (
                        <XSmallText color={Color.DARK_GRAY}>
                          {selectedItem.description}
                        </XSmallText>
                      )}
                    </ContentContainer>
                    <SmallImage
                      borderRadius={30}
                      source={
                        isOpened
                          ? require('../../assets/images/expand_less.png')
                          : require('../../assets/images/expand_more.png')
                      }
                    />
                  </ContentContainer>
                );
              }}
              dropdownStyle={styles.dropdownList}
              dropdownOverlayColor={'transparent'}
              renderItem={(item, index, isSelected) => {
                return (
                  <ContentContainer useHorizontalLayout>
                    <ContentContainer flex={1} withContentPadding gap={8}>
                      <XSmallTitle>{item.label}</XSmallTitle>
                      <XSmallText color={Color.DARK_GRAY}>
                        {item.description}
                      </XSmallText>
                    </ContentContainer>
                  </ContentContainer>
                );
              }}
              showsVerticalScrollIndicator={false}
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
        </ContentContainer>
      </LoadingContainer>
    </ScreenContainer>
  );
};
export default HeroSharePage;
