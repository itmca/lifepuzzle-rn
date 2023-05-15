/* eslint-disable no-mixed-spaces-and-tabs */
import React from 'react';
import {styles} from './styles';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useRecoilState, useRecoilValue} from 'recoil';
import {
  helpQuestionOpenState,
  helpQuestionTextState,
} from '../../recoils/help-question.recoil';
import { MediumImage, SmallImage } from "../styled/components/Image";
import { SmallText } from "../styled/components/Text";

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
        <MediumImage
          source={require('../../assets/images/puzzle-onepiece.png')}
        />
        <View style={styles.verticalLine}></View>
        <SmallText color={'#707070'} fontWeight={900} marginLeft={24.5} marginRight={36.15}>{helpQuestion}</SmallText>
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
