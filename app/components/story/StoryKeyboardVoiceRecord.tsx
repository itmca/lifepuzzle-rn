import {View} from 'react-native';
import {Avatar, Button, List} from 'react-native-paper';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {SmallText, XSmallText} from '../styled/components/Text';
import {useRecoilValue, useResetRecoilState} from 'recoil';
import {recordFileState} from '../../recoils/story-writing.recoil';
import {SmallImage} from '../styled/components/Image';
import {styles} from './styles';

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
    <View style={{flexDirection: 'row', width: '100%'}}>
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
      <View
        style={{
          backgroundColor: '#F6F6F6',
          width: 24,
          height: 24,
          borderRadius: 30,
        }}></View>
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
    <List.Accordion
      title={'음성 업로드 (선택)'}
      right={props =>
        hasRecordFile() ? (
          <RecordedVoice
            fileName={getFileName()}
            recordTime={recordFileInfo?.recordTime || ''}
            onDelete={resetRecord}
          />
        ) : (
          <></>
        )
      }
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
      }></List.Accordion>
  );
};
