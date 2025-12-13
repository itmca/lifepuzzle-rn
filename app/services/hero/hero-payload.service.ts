import { IMG_TYPE } from '../../constants/upload-file-type.constant.ts';
import { WritingHeroType } from '../../types/core/hero.type.ts';
import { PayloadBuilder } from '../../utils/payload-builder.util.ts';
import { generateImagePath } from '../../utils/file-path.util.ts';

const addHeroPhoto = (
  formData: FormData,
  writingHero: WritingHeroType | undefined,
): void => {
  const photo = writingHero?.modifiedImage;
  if (photo?.node?.image?.uri) {
    PayloadBuilder.addPhotoToFormData(formData, 'photo', photo, IMG_TYPE);
  }
};

const addHeroData = (
  formData: FormData,
  writingHeroKey: number,
  writingHero: WritingHeroType | undefined,
): void => {
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
    profileImageUpdate: writingHero?.profileImageUpdate ?? false,
  };

  PayloadBuilder.addJsonToFormData(formData, 'toWrite', savedHero);
};

export const HeroPayloadService = {
  createHeroFormData(
    writingHeroKey: number,
    writingHero: WritingHeroType | undefined,
  ): FormData {
    const formData = PayloadBuilder.createFormData();

    addHeroPhoto(formData, writingHero);
    addHeroData(formData, writingHeroKey, writingHero);

    return formData;
  },
} as const;
