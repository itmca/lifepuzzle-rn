import {Image, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import Text, {XSmallText} from '../styled/components/Text';
import {useRecoilValue, useResetRecoilState} from 'recoil';
import {recordFileState} from '../../recoils/story-writing.recoil';
import {SmallImage} from '../styled/components/Image';
import {styles} from './styles';
import TouchableRipple from 'react-native-paper/src/components/TouchableRipple/TouchableRipple';

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
    <View style={{flexDirection: 'row'}}>
      <View style={styles.storyAudioIcon}>
        <SmallImage
          width={12}
          height={18}
          style={{tintColor: '#B4B3B3'}}
          source={require('../../assets/images/mic.png')}
        />
        <XSmallText style={{fontSize: 7, color: '#B4B3B3'}}>
          {recordTime}
        </XSmallText>
      </View>
      <TouchableOpacity
        style={styles.uploadIconContainer}
        onPress={() => {
          onDelete();
        }}>
        <Image
          style={{width: 18, height: 18, tintColor: '#B4B3B3'}}
          source={require('../../assets/images/close.png')}
        />
      </TouchableOpacity>
    </View>
  );
};
export const StoryKeyboardVoiceRecord = (): JSX.Element => {
  const navigation = useNavigation();
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
              screen: 'PuzzleWritingNavigator',
              params: {
                screen: 'PuzzleWritingVoice',
              },
            })
          )
        }>
        <View
          style={{
            flexDirection: 'row',
            marginVertical: 6,
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View style={{paddingLeft: 16, flexDirection: 'row'}}>
            <Text style={{fontSize: 16}}>녹음본 업로드 </Text>
            <Text style={{fontSize: 14, color: '#B4B3B3'}}>(선택)</Text>
          </View>
          <View
            style={{
              marginVertical: 6,
              paddingLeft: 8,
            }}>
            {hasRecordFile() && (
              <RecordedVoice
                fileName={getFileName()}
                recordTime={recordFileInfo?.recordTime || ''}
                onDelete={resetRecord}
              />
            )}
          </View>
        </View>
      </TouchableRipple>
    </>
  );
};
