import {PhotoIdentifier,} from '@react-native-camera-roll/camera-roll';
import React from 'react';

import {Dimensions, ScrollView, View,} from 'react-native';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import HelpQuestion from '../../components/help-question/HelpQuestion';

import SelectablePhoto from '../../components/photo/SelectablePhoto';
import SelectedPhoto from '../../components/photo/SelectedPhoto';
import TopDescriptionBox from '../../components/photo/TopDescriptionBox';
import {mainSelectedPhotoState, selectedPhotoState,} from '../../recoils/selected-photo.recoil';
import {usePhotoLibrary} from "../../service/hooks/photo.hook";

const DeviceWidth = Dimensions.get('window').width;

const PuzzleWritingPhotoPage = (): JSX.Element => {
    const {photos} = usePhotoLibrary();
    const setSelectedPhotoList = useSetRecoilState(selectedPhotoState);
    const selectedPhoto = useRecoilValue(mainSelectedPhotoState);

    return (
        <>
            <HelpQuestion/>
            <TopDescriptionBox/>
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                <SelectedPhoto size={DeviceWidth} photo={selectedPhoto}/>
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
            </View>
        </>
    );
};

export default PuzzleWritingPhotoPage;
