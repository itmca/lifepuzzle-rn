import {useEffect} from 'react';
import {
  checkMultiple,
  PERMISSIONS,
  requestMultiple,
  RESULTS,
} from 'react-native-permissions';
import {PermissionsAndroid, Platform} from 'react-native';

type PermissionTarget = 'voice' | 'photo';

export type Permission = {
  target: PermissionTarget;
  onAgree?: () => void;
  onDeny?: () => void;
};

type PermissionProps = {
  permissions: Permission[];
};
export const usePermission = ({permissions}: PermissionProps) => {
  permissions.forEach(permission => {
    if (permission.target === 'voice') {
      useVoicePermission(permission);
    } else if (permission.target === 'photo') {
      usePhotoPermission(permission);
    }
  });
};

export const useVoicePermission = ({
  onAgree,
  onDeny,
}: Pick<Permission, 'onAgree' | 'onDeny'>) => {
  useEffect(() => {
    void checkPermissions();
  }, []);
  const permissions = Platform.select({
    ios: [PERMISSIONS.IOS.MICROPHONE],
    android: [
      PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
      PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      PERMISSIONS.ANDROID.RECORD_AUDIO,
    ],
  });
  const requestPermissions = async () => {
    if (permissions) {
      const statuses = await requestMultiple(permissions);
      const allGranted = permissions.every(
        permission => statuses[permission] === RESULTS.GRANTED,
      );
      if (!allGranted) {
        onDeny?.();
        return;
      }
    }
  };
  const checkPermissions = async () => {
    if (permissions) {
      const statuses = await checkMultiple(permissions);
      const allGranted = permissions.every(
        permission => statuses[permission] === RESULTS.GRANTED,
      );
      if (!allGranted) {
        requestPermissions();
      }
    }
  };
};
export const usePhotoPermission = ({
  onAgree,
  onDeny,
}: Pick<Permission, 'onAgree' | 'onDeny'> = {}) => {
  const checkAndRequestAndroidPermission = async () => {
    if (Platform.OS === 'android' && !(await hasAndroidPermission())) {
      onDeny?.();
      return;
    }
  };

  useEffect(() => {
    checkAndRequestAndroidPermission();
  }, []);
};

export async function hasAndroidPermission() {
  const getCheckPermissionPromise = () => {
    if (Number(Platform.Version) >= 33) {
      return Promise.all([
        PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
        ),
        PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
        ),
      ]).then(
        ([hasReadMediaImagesPermission, hasReadMediaVideoPermission]) =>
          hasReadMediaImagesPermission && hasReadMediaVideoPermission,
      );
    } else {
      return PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      );
    }
  };

  const hasPermission = await getCheckPermissionPromise();
  if (hasPermission) {
    return true;
  }
  const getRequestPermissionPromise = () => {
    if (Number(Platform.Version) >= 33) {
      return PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
      ]).then(
        statuses =>
          statuses[PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          statuses[PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO] ===
            PermissionsAndroid.RESULTS.GRANTED,
      );
    } else {
      return PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      ).then(status => status === PermissionsAndroid.RESULTS.GRANTED);
    }
  };

  return await getRequestPermissionPromise();
}
