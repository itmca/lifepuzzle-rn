import Modal from 'react-native-modal';
import {useState} from 'react';
import {Image, TouchableOpacity, View} from 'react-native';
import {MediumText} from '../styled/components/Text';
import styles from './styles';
import {isModalOpening} from '../../recoils/story-writing.recoil';
import {useRecoilState} from 'recoil';
type Props = {
  text: string;
};
const WriteCompletedModal = ({text}: Props): JSX.Element => {
  const [isModalVisible, setModalVisible] = useRecoilState(isModalOpening);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    <Modal
      animationIn="fadeIn"
      animationOut="fadeOut"
      isVisible={isModalVisible}
      style={{justifyContent: 'center', alignItems: 'center'}}>
      <View style={styles.modalContainer}>
        <View style={styles.modalCloseBtnContainer}>
          <TouchableOpacity
            style={{position: 'absolute', right: 12.76, top: 12.76}}
            onPress={toggleModal}>
            <Image source={require('../../assets/images/modal-close.png')} />
          </TouchableOpacity>
        </View>
        <View style={styles.modalContentContainer}>
          <Image
            source={require('../../assets/images/celebration-character.png')}
            style={{marginBottom: 11}}
          />
          <MediumText color={'#FFFFFF'}>{text}</MediumText>
        </View>
      </View>
    </Modal>
  );
};

export default WriteCompletedModal;
