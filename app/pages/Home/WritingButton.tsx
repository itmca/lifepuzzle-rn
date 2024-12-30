import React from 'react';

import {Platform, StyleSheet, TouchableOpacity} from 'react-native';
import {useRecoilValue} from 'recoil';
import {isLoggedInState} from '../../recoils/auth.recoil';
import {XLargeText} from '../../components/styled/components/Text';
import {Color} from '../../constants/color.constant';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {ContentContainer} from '../../components/styled/container/ContentContainer';

type Props = {
  tagLabel: string;
  onPress: () => void;
};

const styles = StyleSheet.create({
  writingButton: {
    width: '100%',
    height: 64,
    borderRadius: 16,
    backgroundColor: Color.PRIMARY_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowOffset: {
          width: 0,
          height: 0,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 1,
      },
    }),
  },
});

export const WritingButton = ({onPress, tagLabel}: Props): JSX.Element => {
  const isLoggedIn = useRecoilValue(isLoggedInState);

  return (
    <TouchableOpacity onPress={onPress} style={styles.writingButton}>
      <ContentContainer
        useHorizontalLayout
        backgroundColor="transparent"
        alignCenter
        gap={8}>
        <Icon size={30} color={Color.WHITE} name={'camera'} />
        <XLargeText color={Color.WHITE} fontWeight={700}>
          {`${tagLabel} 사진/동영상 추가하기`}
        </XLargeText>
      </ContentContainer>
    </TouchableOpacity>
  );
};
