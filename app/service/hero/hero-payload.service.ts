import { IMG_TYPE } from '../../constants/upload-file-type.constant';
import { WritingHeroType } from '../../types/core/hero.type';
import { PayloadBuilder } from '../utils/payload-builder.service';
import { generateImagePath } from '../utils/file-path.service';

export class HeroPayloadService {
  static createHeroFormData(
    writingHeroKey: number,
    writingHero: WritingHeroType | undefined,
  ): FormData {
    const formData = PayloadBuilder.createFormData();

    this.addHeroPhoto(formData, writingHero);
    this.addHeroData(formData, writingHeroKey, writingHero);

    return formData;
  }

  private static addHeroPhoto(
    formData: FormData,
    writingHero: WritingHeroType | undefined,
  ): void {
    const photo = writingHero?.modifiedImage;
    if (photo?.node?.image?.uri) {
      PayloadBuilder.addPhotoToFormData(formData, 'photo', photo, IMG_TYPE);
    }
  }

  private static addHeroData(
    formData: FormData,
    writingHeroKey: number,
    writingHero: WritingHeroType | undefined,
  ): void {
    const photo = writingHero?.modifiedImage;
    const imgPath = photo?.node?.image?.uri
      ? generateImagePath(photo.node.image.uri, writingHero?.imageUrl)
      : writingHero?.imageUrl;

    const savedHero = {
      id: writingHeroKey,
      name: writingHero?.name,
      nickName: writingHero?.nickName,
      birthday: writingHero?.birthday,
      isLunar: writingHero?.isLunar,
      title: writingHero?.title,
      imageUrl: imgPath ?? '',
      isProfileImageUpdate: writingHero?.isProfileImageUpdate ?? false,
    };

    PayloadBuilder.addJsonToFormData(formData, 'toWrite', savedHero);
  }
}
