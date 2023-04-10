import {useEffect, useState} from "react";
import {CameraRoll, cameraRollEventEmitter, PhotoIdentifier} from "@react-native-camera-roll/camera-roll";
import {EmitterSubscription, Platform} from "react-native";
import {usePhotoPermission} from "./permission.hook";

type Props = {
    initialSize: number;
    nextSize: number;
}

type Response = {
    photos: PhotoIdentifier[];
}
export const usePhotoLibrary = ({initialSize = 20, nextSize = 20}: Props = {}): Response => {
    const [photos, setPhotos] = useState<PhotoIdentifier[]>([]);

    usePhotoPermission()

    useEffect(() => {
        void loadPhotos();
    }, [])

    const loadPhotos = async () => {
        const result = await CameraRoll.getPhotos({
            first: initialSize,
            assetType: 'Photos',
        });
        setPhotos(result.edges);
    };

    const isAboveIOS14 =
        Platform.OS === 'ios' && parseInt(Platform.Version, 10) >= 14;

    useEffect(() => {
        let subscription: EmitterSubscription;
        if (isAboveIOS14) {
            subscription = cameraRollEventEmitter.addListener(
                'onLibrarySelectionChange',
                () => {
                    void loadPhotos();
                },
            );
        }

        return () => {
            if (isAboveIOS14 && subscription) {
                subscription.remove();
            }
        };
    }, []);

    return {photos};
};