import {IMG_TYPE} from '../../constants/upload-file-type.constant';
import {UserType} from '../../types/core/user.type';
import {PayloadBuilder} from '../utils/payload-builder.service';
import {generateImagePath} from '../utils/file-path.service';

export class UserPayloadService {
  static createUserFormData(userNo: number, modifyingUser: UserType): FormData {
    const formData = PayloadBuilder.createFormData();

    this.addUserPhoto(formData, modifyingUser);
    this.addUserData(formData, userNo, modifyingUser);

    return formData;
  }

  private static addUserPhoto(
    formData: FormData,
    modifyingUser: UserType,
  ): void {
    const photo = modifyingUser?.modifiedImage;
    if (photo) {
      PayloadBuilder.addPhotoToFormData(formData, 'photo', photo, IMG_TYPE);
    }
  }

  private static addUserData(
    formData: FormData,
    userNo: number,
    modifyingUser: UserType,
  ): void {
    const photo = modifyingUser?.modifiedImage;
    const imgPath = photo?.node?.image?.uri
      ? generateImagePath(photo.node.image.uri, modifyingUser?.imageUrl)
      : modifyingUser?.imageUrl;

    const savedUser: UserType = {
      ...modifyingUser,
      userNo,
      userNickName: modifyingUser.userNickName,
      imageUrl: imgPath,
    };

    PayloadBuilder.addJsonToFormData(formData, 'toUpdate', savedUser);
  }
}
