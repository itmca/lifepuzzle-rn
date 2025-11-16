import {useHeroStore} from '../../stores/hero.store';
import {IMG_TYPE} from '../../constants/upload-file-type.constant';
import {WritingHeroType} from '../../types/core/hero.type';
import {PhotoIdentifier} from '@react-native-camera-roll/camera-roll';

export const useHeroHttpPayLoad = () => {
  const formData = new FormData();
  const writingHeroKey = useHeroStore(state => state.writingHeroKey);
  const writingHero = useHeroStore(state => state.writingHero);

  addHeroPhotoInFormData(formData, writingHero);
  addHeroInFormData(formData, writingHeroKey, writingHero);
  return formData;
};

const addHeroPhotoInFormData = function (
  formData: FormData,
  writingHero: WritingHeroType | undefined,
) {
  const photo = writingHero?.modifiedImage;
  if (photo?.node?.image?.uri) {
    const uri = photo.node.image.uri;
    const fileParts = uri?.split('/');
    // const fileName =
    //   (uri.startsWith('https://lifepuzzle') ? 'lp-media-' : '') +
    //   photo.node.image.filename;
    const fileName = fileParts ? fileParts[fileParts?.length - 1] : undefined;
    const type = IMG_TYPE;

    formData.append('photo', {
      uri: uri,
      type: type,
      name: fileName,
    });
  }
};
const addHeroInFormData = (
  formData: FormData,
  writingHeroKey: number,
  writingHero: WritingHeroType | undefined,
) => {
  const photo: PhotoIdentifier | undefined = writingHero?.modifiedImage;

  const currentTime = Date.now();
  const uri = photo?.node.image.uri;
  const fileParts = uri?.split('/');
  const imgName = fileParts ? fileParts[fileParts?.length - 1] : undefined;
  const imgPath = photo
    ? `${currentTime}_${String(imgName)}`
    : writingHero?.imageUrl;

  const savedHero = {
    heroNo: writingHeroKey,
    heroName: writingHero?.heroName,
    heroNickName: writingHero?.heroNickName,
    birthday: writingHero?.birthday,
    isLunar: writingHero?.isLunar,
    title: writingHero?.title,
    imageUrl: imgPath ?? '',
    isProfileImageUpdate: writingHero?.isProfileImageUpdate ?? false,
  };

  formData.append('toWrite', {
    string: JSON.stringify(savedHero),
    type: 'application/json',
  });
};
