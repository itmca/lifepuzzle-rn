import React from 'react';
import Modal from 'react-native-modal';
import {Image, View} from 'react-native';
import {SmallText} from '../styled/components/LegacyText.tsx';
import styles from './styles';
import {Color} from '../../constants/color.constant';
import {ModalButton} from '../button/ModalButton';

type Props = {
  message: string;
  leftBtnText: string;
  rightBtnText?: string;
  onLeftBtnPress: () => void;
  onRightBtnPress?: () => void;
  imageSource: number;
  isModalOpen: boolean;
};
const ImageModal = ({
  message,
  leftBtnText,
  rightBtnText,
  onLeftBtnPress,
  onRightBtnPress,
  imageSource,
  isModalOpen,
}: Props): React.JSX.Element => {
  return (
    <Modal
      animationIn="fadeIn"
      animationOut="fadeOut"
      isVisible={isModalOpen}
      style={{justifyContent: 'flex-start', top: 100, alignItems: 'center'}}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContentContainer}>
          <Image source={imageSource} style={{marginBottom: 20}} />
          <SmallText color={Color.FONT_DARK} fontWeight={600}>
            {message}
          </SmallText>
        </View>
        <View style={styles.modalButtonContainer}>
          <ModalButton
            onPress={onLeftBtnPress}
            flexBasis={rightBtnText && onRightBtnPress ? '50%' : '100%'}
            backgroundColor={
              rightBtnText && onRightBtnPress ? '#F9F9F9' : '#FF6200'
            }
            borderTopLeftRadius={0}
            borderTopRightRadius={0}
            borderBottomLeftRadius={8}
            borderBottomRightRadius={0}
            text={leftBtnText}
            fontColor={rightBtnText && onRightBtnPress ? '#B4B3B3' : '#FFFFFF'}
            fontWeight="500"
          />
          {rightBtnText && onRightBtnPress && (
            <ModalButton
              onPress={onRightBtnPress}
              flexBasis="50%"
              backgroundColor="#FF6200"
              borderTopLeftRadius={0}
              borderTopRightRadius={0}
              borderBottomLeftRadius={0}
              borderBottomRightRadius={8}
              text={rightBtnText}
              fontColor="#FFFFFF"
              fontWeight="700"
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

export default ImageModal;
