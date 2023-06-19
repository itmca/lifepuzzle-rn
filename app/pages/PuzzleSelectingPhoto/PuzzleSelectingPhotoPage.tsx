import {useNavigation} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {
  Alert,
  Dimensions,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import SelectablePhoto from '../../components/photo/SelectablePhoto';
import {PhotoIdentifier} from '@react-native-camera-roll/camera-roll';
import {usePhotoLibrary} from '../../service/hooks/photo.hook';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import {
  mainSelectedPhotoState,
  selectedPhotoState,
} from '../../recoils/selected-photo.recoil';
import {ContentContainer} from '../../components/styled/container/ContentContainer';

const DeviceWidth = Dimensions.get('window').width;
const PuzzleSelectingPhotoPage = (): JSX.Element => {
  const {photos} = usePhotoLibrary();
  const setSelectedPhotoList = useSetRecoilState(selectedPhotoState);

  useEffect(() => {
    setSelectedPhotoList([]);
  }, []);
  return (
    <ContentContainer>
      <ScrollView
        style={{height: 500}}
        contentContainerStyle={{
          flexDirection: 'row',
          flexWrap: 'wrap',
        }}>
        {photos?.map((photo, index) => {
          return (
            <SelectablePhoto
              key={index}
              onSelected={(photo: PhotoIdentifier) => {
                setSelectedPhotoList(prev => prev.concat([photo]));
              }}
              //! size 수정 필요
              onDeselected={(photo: PhotoIdentifier) => {
                setSelectedPhotoList(prev =>
                  prev.filter(e => e.node.image.uri !== photo.node.image.uri),
                );
              }}
              size={DeviceWidth / 3}
              photo={photo}
            />
          );
        })}
      </ScrollView>
    </ContentContainer>
  );
};
export default PuzzleSelectingPhotoPage;
