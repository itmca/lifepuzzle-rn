import {useRecoilValue} from 'recoil';
import {IMG_TYPE} from '../../constants/upload-file-type.constant';
import {PhotoIdentifier} from '@react-native-camera-roll/camera-roll';
import {UserType} from '../../types/user.type.ts';
import {userState, writingUserState} from '../../recoils/auth/user.recoil.ts';

export const useUserHttpPayLoad = () => {
  const formData = new FormData();
  const user = useRecoilValue(userState);
  const modifyingUser = useRecoilValue(writingUserState);

  addUserPhotoInFormData(formData, modifyingUser);
  addUserInFormData(formData, user.userNo, modifyingUser);

  return formData;
};

const addUserPhotoInFormData = (
  formData: FormData,
  modifyingUser: UserType,
) => {
  const photo: PhotoIdentifier | undefined = modifyingUser?.modifiedImage;

  if (!photo) {
    return;
  }

  const uri = photo.node.image.uri;
  const fileParts = uri?.split('/');
  const fileName = fileParts ? fileParts[fileParts?.length - 1] : undefined;
  const type = IMG_TYPE;

  formData.append('photo', {
    uri: uri,
    type: type,
    name: fileName,
  });
};

const addUserInFormData = (
  formData: FormData,
  userNo: number,
  modifyingUser: UserType,
) => {
  const photo: PhotoIdentifier | undefined = modifyingUser?.modifiedImage;

  const currentTime = Date.now();
  const uri = photo?.node.image.uri;
  const fileParts = uri?.split('/');
  const imgName = fileParts ? fileParts[fileParts?.length - 1] : undefined;
  const imgPath = photo
    ? `${currentTime}_${String(imgName)}`
    : modifyingUser?.imageURL;

  const savedUser: UserType = {
    ...modifyingUser,
    userNo,
    userNickName: modifyingUser.userNickName,
    imageURL: imgPath,
  };

  formData.append('toUpdate', {
    string: JSON.stringify(savedUser),
    type: 'application/json',
  });
};
