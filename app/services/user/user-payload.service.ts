import { IMG_TYPE } from '../../constants/upload-file-type.constant.ts';
import { UserType } from '../../types/core/user.type.ts';
import { PayloadBuilder } from '../../utils/payload-builder.util.ts';
import { generateImagePath } from '../../utils/file-path.util.ts';

const addUserPhoto = (formData: FormData, modifyingUser: UserType): void => {
  const photo = modifyingUser?.modifiedImage;
  if (photo) {
    PayloadBuilder.addPhotoToFormData(formData, 'photo', photo, IMG_TYPE);
  }
};

const addUserData = (
  formData: FormData,
  userNo: number,
  modifyingUser: UserType,
): void => {
  const photo = modifyingUser?.modifiedImage;
  const imgPath = photo?.node?.image?.uri
    ? generateImagePath(photo.node.image.uri, modifyingUser?.imageUrl)
    : modifyingUser?.imageUrl;

  const savedUser = {
    ...modifyingUser,
    id: userNo,
    nickName: modifyingUser.nickName,
    imageUrl: imgPath,
  };

  PayloadBuilder.addJsonToFormData(formData, 'toUpdate', savedUser);
};

export const UserPayloadService = {
  createUserFormData(userNo: number, modifyingUser: UserType): FormData {
    const formData = PayloadBuilder.createFormData();

    addUserPhoto(formData, modifyingUser);
    addUserData(formData, userNo, modifyingUser);

    return formData;
  },
} as const;
