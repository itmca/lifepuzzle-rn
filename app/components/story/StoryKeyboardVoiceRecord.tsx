import {Image, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import Text, {
  MediumText,
  SmallText,
  XSmallText,
} from '../styled/components/Text';
import {useRecoilValue, useResetRecoilState} from 'recoil';
import {recordFileState} from '../../recoils/story-writing.recoil';
import {SmallImage, XSmallImage} from '../styled/components/Image';
import {styles} from './styles';
import TouchableRipple from 'react-native-paper/src/components/TouchableRipple/TouchableRipple';
import {Color} from '../../constants/color.constant';
import {BasicNavigationProps} from '../../navigation/types';
import {HorizontalContentContainer} from '../styled/container/ContentContainer';

type VoiceRecordProps = {
  fileName: string;
  recordTime: string;
  onDelete: () => void;
};

const RecordedVoice = ({
  fileName,
  recordTime,
  onDelete,
}: VoiceRecordProps): JSX.Element => {
  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        backgroundColor: Color.PRIMARY_LIGHT,
        borderRadius: 5,
        width: 70,
        height: 32,
        justifyContent: 'space-evenly',
        alignItems: 'center',
      }}
      onPress={() => {
        onDelete();
      }}>
      <XSmallImage
        style={{
          backgroundColor: Color.WHITE,
          borderRadius: 16,
          tintColor: Color.PRIMARY_LIGHT,
        }}
        source={require('../../assets/images/mic.png')}
      />
      <XSmallText color={Color.WHITE}>
        {recordTime.substring(recordTime.indexOf(':') + 1)}
      </XSmallText>
    </TouchableOpacity>
  );
};
export const StoryKeyboardVoiceRecord = (): JSX.Element => {
  const navigation = useNavigation<BasicNavigationProps>();
  const recordFileInfo = useRecoilValue(recordFileState);
  const resetRecord = useResetRecoilState(recordFileState);

  const hasRecordFile = function () {
    return recordFileInfo != undefined && recordFileInfo?.filePath != undefined;
  };

  const getFileName = function () {
    if (!hasRecordFile()) {
      return '';
    }

    const fileParts = recordFileInfo?.filePath?.split('/') || [];
    const recordName = fileParts[fileParts?.length - 1];

    return decodeURI(recordName);
  };

  return (
    <>
      <TouchableRipple
        style={{
          paddingVertical: 8,
          paddingRight: 24,
        }}
        onPress={props =>
          hasRecordFile() ? (
            <></>
          ) : (
            navigation.push('NoTab', {
              screen: 'StoryWritingNavigator',
              params: {
                screen: 'StoryWritingVoice',
              },
            })
          )
        }>
        <HorizontalContentContainer
          style={{
            marginVertical: 6,
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <MediumText style={{paddingLeft: 16}}>
            녹음본 업로드 <SmallText color={Color.DARK_GRAY}>(선택)</SmallText>
          </MediumText>
          <View
            style={{
              marginVertical: 6,
            }}>
            {hasRecordFile() && (
              <RecordedVoice
                fileName={getFileName()}
                recordTime={recordFileInfo?.recordTime || ''}
                onDelete={resetRecord}
              />
            )}
          </View>
        </HorizontalContentContainer>
      </TouchableRipple>
    </>
  );
};
