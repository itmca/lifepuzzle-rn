import {Text, View} from 'react-native';
import styles from '../../pages/PuzzleWritingText/styles';
import {Avatar, Button} from 'react-native-paper';

import Icon from 'react-native-vector-icons/MaterialIcons';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {useRecoilValue, useResetRecoilState} from 'recoil';
import {recordFileState} from '../../recoils/story-writing.recoil';

const VoiceRecordPageLink = (): JSX.Element => {
  const navigation = useNavigation();

  return (
    <Button
정      onPress={() => {
        navigation.push('NoTab', {
          screen: 'PuzzleWritingNavigator',
          params: {
            screen: 'PuzzleWritingVoice',
          },
        });
      }}
      style={{
        ...styles.voiceBox,
        alignSelf: 'stretch',
        height: '100%',
        flexDirection: 'column',
      }}>
      <Icon name={'mic'} size={13}></Icon>
      <Text style={{fontSize: 16}}> 음성 녹음하기</Text>
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
        <View style={{...styles.voiceBox, flex: 1, flexDirection: 'row'}}>
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
                <Text style={{fontSize: 7, marginTop: 4}}>
                    {fileName} | {recordTime}
                </Text>
            </View>
            <View style={{flex: 1, justifyContent: 'center'}}>
                <Text
                    onPress={onDelete}
                    style={{fontSize: 12, textAlign: 'right', padding: 14}}>
                    삭제하기
                </Text>
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
        <View style={{height: 56}}>
            {hasRecordFile() ? (
                <RecordedVoice
                    fileName={getFileName()}
                    recordTime={recordFileInfo?.recordTime || ''}
                    onDelete={resetRecord}
                />
            ) : (
                <VoiceRecordPageLink/>
            )}
        </View>
    );
};
