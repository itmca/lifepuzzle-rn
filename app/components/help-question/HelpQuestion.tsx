/* eslint-disable no-mixed-spaces-and-tabs */
import React from 'react';
import {styles} from './styles';
import { TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useRecoilState, useRecoilValue} from 'recoil';
import {
  helpQuestionOpenState,
  helpQuestionTextState,
} from '../../recoils/help-question.recoil';
import Image,{ SmallImage } from '../styled/components/Image';
import { SmallText } from '../styled/components/Text';

const HelpQuestion = (): JSX.Element => {
  const helpQuestion = useRecoilValue(helpQuestionTextState);
  const [open, setOpen] = useRecoilState(helpQuestionOpenState);

  if (!helpQuestion) {
    return <></>;
  }

  if (!open) {
    return (
      <View style={styles.container}>
        <View style={styles.smallSizeWrapper}>
          <TouchableOpacity
            onPress={() => {
              setOpen(true);
            }}>
            <SmallImage
              source={require('../../assets/images/puzzle-onepiece.png')}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.bigSizeWrapper}>
        <Image
          source={require('../../assets/images/puzzle-onepiece.png')}
        />
        <View style={styles.verticalLine}></View>
        <SmallText  style={styles.helpQuestionText}>{helpQuestion}</SmallText>
        <TouchableOpacity
          onPress={() => setOpen(false)}
          style={styles.closeIconWrapper}>
          <Icon name="chevron-left" size={24} style={styles.closeIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HelpQuestion;
