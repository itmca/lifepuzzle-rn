import {useEffect} from 'react';
import Permissions, {
  check,
  checkMultiple,
  PERMISSIONS,
  request,
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
    void checkAndRequestAndroidPermission();
  }, []);
};

export async function hasAndroidPermission() {
  const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

  const hasPermission = await PermissionsAndroid.check(permission);
  if (hasPermission) {
    return true;
  }

  const status = await PermissionsAndroid.request(permission);
  return status === 'granted';
}
