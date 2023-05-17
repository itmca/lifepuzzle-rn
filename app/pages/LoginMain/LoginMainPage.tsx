import React, {useState} from 'react';

import {Image, Platform, Text, View} from 'react-native';
import KaKaoSocialLoginButton from '../../components/button/login/KaKaoSocialLoginButton';
import AppleSocialLoginButton from '../../components/button/login/AppleSocialLoginButton';
import OtherLoginButton from '../../components/button/login/OtherLoginButton';
import {styles} from './styles';
import {LoadingContainer} from '../../components/loadding/LoadingContainer';
import {ContentContainer} from '../../components/styled/container/ContentContainer';
import {ScreenContainer} from '../../components/styled/container/ScreenContainer';

const LoginMainPage = (): JSX.Element => {
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <ScreenContainer>
      <LoadingContainer isLoading={loading}>
        <ContentContainer>
          <Image
            source={require('../../assets/images/puzzle-4piece-squared.png')}
            style={styles.logo}
          />
          <Text style={styles.registerText}> 사랑하는 사람의 이야기를 </Text>
          <Text style={styles.registerText}> 한조각씩 맞추어 보세요 </Text>
        </ContentContainer>
        <ContentContainer>
          <KaKaoSocialLoginButton onChangeLoading={setLoading} />
          {Platform.OS === 'ios' && (
            <AppleSocialLoginButton
              onChangeLoading={loading => {
                console.log('loading: ', loading);
              }}
            />
          )}
          <OtherLoginButton />
        </ContentContainer>
      </LoadingContainer>
    </ScreenContainer>
  );
};

export default LoginMainPage;
