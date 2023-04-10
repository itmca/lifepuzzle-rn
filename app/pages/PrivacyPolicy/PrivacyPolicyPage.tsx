import React from 'react';
import WebView from 'react-native-webview';
import {SafeAreaView, View} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Button} from 'react-native-paper';
import {PolicyRouteProps} from '../../navigation/types';

export const PrivacyPolicyPage = (): JSX.Element => {
  const navigation = useNavigation();
  const {
    params: {settingAgree},
  } = useRoute<PolicyRouteProps<'PrivacyPolicy'>>();

  return (
    <>
      <SafeAreaView style={{backgroundColor: '#ffffff'}}>
        <View
          style={{
            justifyContent: 'space-between',
            width: '100%',
            flexDirection: 'row',
            backgroundColor: '#ffffff',
          }}>
          <Button
            labelStyle={{
              fontSize: 16,
              color: '#343666',
            }}
            onPress={() => {
              settingAgree(false);
              navigation.goBack();
            }}>
            비동의
          </Button>
          <Button
            labelStyle={{
              fontSize: 16,
              color: '#343666',
            }}
            onPress={() => {
              settingAgree(true);
              navigation.goBack();
            }}>
            동의
          </Button>
        </View>
      </SafeAreaView>
      <WebView
        style={{paddingLeft: 8, paddingRight: 8}}
        source={{uri: 'https://itmca.io/terms/privacy'}}
      />
    </>
  );
};
