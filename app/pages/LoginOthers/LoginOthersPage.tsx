import React, {useState} from 'react';

import {Image, Platform, Text, TouchableOpacity, View} from 'react-native';
import KaKaoSocialLoginButton from '../../components/button/login/KaKaoSocialLoginButton';
import AppleSocialLoginButton from '../../components/button/login/AppleSocialLoginButton';
import {styles} from './styles';
import GeneralLoginButton from '../../components/button/login/GeneralLoginButton';
import {LoadingContainer} from '../../components/loadding/LoadingContainer';
import {useNavigation} from '@react-navigation/native';
import {BasicTextInput} from '../../components/input/BasicTextInput';
import {PasswordInput} from '../../components/input/PasswordInput';

const LoginOthersPage = (): JSX.Element => {
  const navigation = useNavigation();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <View style={styles.mainContainer}>
      <LoadingContainer isLoading={loading}>
        <View style={styles.topContainer}>
          <Image
            source={require('../../assets/images/puzzle-4piece-squared.png')}
            style={styles.logo}
          />
          <Text style={styles.registerText}> 인생 퍼즐</Text>
        </View>
        <View style={styles.loginTextContainer}>
          <Text style={styles.loginText}>로그인</Text>
        </View>
        <View style={styles.formContainer}>
          <BasicTextInput label="아이디" text={id} onChangeText={setId} />
          <PasswordInput
            label="비밀번호"
            password={password}
            onChangePassword={setPassword}
          />
          <View style={styles.passwordRegisterContainer}>
            <Text style={styles.passwordRegisterText}> </Text>
            <TouchableOpacity
              onPress={() => {
                navigation.push('NoTab', {
                  screen: 'LoginRegisterNavigator',
                  params: {
                    screen: 'Register',
                  },
                });
              }}>
              <Text style={styles.passwordRegisterText}>회원가입</Text>
            </TouchableOpacity>
          </View>
          <GeneralLoginButton
            userId={id}
            password={password}
            onChangeLoading={setLoading}
          />
        </View>
        <View style={styles.socialContainer}>
          <KaKaoSocialLoginButton onChangeLoading={setLoading} />
          {Platform.OS === 'ios' && (
            <AppleSocialLoginButton
              onChangeLoading={loading => {
                console.log('loading: ', loading);
              }}
            />
          )}
        </View>
      </LoadingContainer>
    </View>
  );
};

export default LoginOthersPage;
