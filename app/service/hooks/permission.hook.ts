import {useEffect} from 'react';
import Permissions, {
  check,
  PERMISSIONS,
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
    void initVoicePermission().then(() => {
      void hasVoicePermission().then(statuses => {
        const deniedPermissions = Object.values(statuses).filter(
          e => e != RESULTS.GRANTED,
        );
        if (deniedPermissions.length > 0) {
          onDeny?.();
        }
      });
    });
  }, []);

  const initVoicePermission = async function () {
    if (Platform.OS === 'android') {
      return Permissions.requestMultiple([
        PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
        PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
        PERMISSIONS.ANDROID.RECORD_AUDIO,
      ]);
    } else {
      return Permissions.request(PERMISSIONS.IOS.MICROPHONE);
    }
  };

  const hasVoicePermission = async function () {
    if (Platform.OS == 'android') {
      return Permissions.checkMultiple([
        PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
        PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
        PERMISSIONS.ANDROID.RECORD_AUDIO,
      ]);
    } else {
      return Permissions.checkMultiple([PERMISSIONS.IOS.MICROPHONE]);
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
