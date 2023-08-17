import {useNavigation} from '@react-navigation/native';
import React from 'react';

import {Alert, Pressable, Text, View} from 'react-native';
import styles from './styles';
import {useVoicePermission} from '../../service/hooks/permission.hook';
import {useVoiceRecorder} from '../../service/hooks/voice-record.hook';

const StoryWritingVoicePage = (): JSX.Element => {
  const navigation = useNavigation();

  useVoicePermission({
    onDeny: () => {
      Alert.alert('마이크 권한이 없습니다.', '', [
        {
          text: '확인',
          onPress: () => navigation.goBack(),
        },
      ]);
    },
  });

  const {recordFile, isRecording, startRecord, stopRecord} = useVoiceRecorder({
    onStopRecord: () => {
      navigation.goBack();
    },
  });

  return (
    <View style={styles.container}>
      <Text>
        {recordFile?.recordTime?.substring(
          recordFile?.recordTime?.indexOf(':') + 1,
        )}
      </Text>
      <View>
        <Pressable
          style={styles.recordContainer}
          onPress={() => {
            isRecording ? stopRecord() : startRecord();
          }}>
          <View
            style={
              isRecording ? styles.isRecordBox : styles.notIsRecordBox
            }></View>
        </Pressable>
      </View>
    </View>
  );
};
export default StoryWritingVoicePage;
