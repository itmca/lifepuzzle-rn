import {View} from 'react-native';
import {Avatar, Button} from 'react-native-paper';

import Icon from 'react-native-vector-icons/MaterialIcons';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {SmallText, XSmallText} from '../styled/components/Text';
import {useRecoilValue, useResetRecoilState} from 'recoil';
import {recordFileState} from '../../recoils/story-writing.recoil';
import {SmallImage} from '../styled/components/Image';

const VoiceRecordPageLink = (): JSX.Element => {
  const navigation = useNavigation();

  return (
    <Button
      onPress={() => {
        navigation.push('NoTab', {
          screen: 'PuzzleWritingNavigator',
          params: {
            screen: 'PuzzleWritingVoice',
          },
        });
      }}
      style={{
        height: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <SmallImage
        width={14}
        height={19}
        style={{tintColor: 'gray'}}
        source={require('../../assets/images/mic.png')}
      />
      <SmallText style={{color: 'gray'}}> 녹음 추가</SmallText>
    </Button>
  );
};

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
    <View style={{flex: 1, flexDirection: 'row'}}>
      <View style={{flex: 1}}></View>
      <View
        style={{
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          flex: 3,
        }}>
        <Avatar.Icon
          style={{backgroundColor: 'black'}}
          size={27}
          icon="microphone"
        />
        <XSmallText style={{fontSize: 7}}>{fileName}</XSmallText>
        <XSmallText style={{fontSize: 7}}>{recordTime}</XSmallText>
      </View>
      <View style={{flex: 1, justifyContent: 'center'}}>
        <SmallText
          onPress={onDelete}
          style={{textAlign: 'right', marginTop: 0, fontSize: 7}}>
          삭제하기
        </SmallText>
      </View>
    </View>
  );
};
export const StoryKeyboardVoiceRecord = (): JSX.Element => {
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
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
      }}>
      {hasRecordFile() ? (
        <RecordedVoice
          fileName={getFileName()}
          recordTime={recordFileInfo?.recordTime || ''}
          onDelete={resetRecord}
        />
      ) : (
        <VoiceRecordPageLink />
      )}
    </View>
  );
};
