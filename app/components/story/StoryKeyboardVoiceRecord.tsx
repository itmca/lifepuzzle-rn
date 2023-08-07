import {TouchableOpacity, View} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {MediumText, SmallText, XSmallText} from '../styled/components/Text';
import {useRecoilValue, useResetRecoilState} from 'recoil';
import {recordFileState} from '../../recoils/story-writing.recoil';
import {XSmallImage} from '../styled/components/Image';
import TouchableRipple from 'react-native-paper/src/components/TouchableRipple/TouchableRipple';
import {Color} from '../../constants/color.constant';
import {BasicNavigationProps} from '../../navigation/types';
import {HorizontalContentContainer} from '../styled/container/ContentContainer';
import Icon from '../styled/components/Icon';
import {CustomAlert} from '../alert/CustomAlert';

type VoiceRecordProps = {
  recordTime: string;
  onDelete: () => void;
};

const RecordedVoice = ({
  recordTime,
  onDelete,
}: VoiceRecordProps): JSX.Element => {
  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        backgroundColor: Color.PRIMARY_LIGHT,
        borderRadius: 5,
        width: 88,
        height: 32,
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginRight: -8,
      }}
      onPress={() => {
        CustomAlert.actionAlert({
          title: '음성 녹음 삭제',
          desc: '음성 녹음을 삭제하시겠습니까?',
          actionBtnText: '삭제',
          action: () => {
            onDelete();
          },
        });
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
      <Icon name={'cancel'} size={16} style={{color: Color.WHITE}} />
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
          alignItems: 'center',
        }}
        onPress={() =>
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
            {hasRecordFile() ? (
              <RecordedVoice
                recordTime={recordFileInfo?.recordTime || ''}
                onDelete={resetRecord}
              />
            ) : (
              <View style={{height: 32}}></View>
            )}
          </View>
        </HorizontalContentContainer>
      </TouchableRipple>
    </>
  );
};
