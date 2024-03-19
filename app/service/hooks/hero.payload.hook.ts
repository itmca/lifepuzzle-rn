import {useRecoilValue} from 'recoil';
import {
  writingHeroKeyState,
  writingHeroState,
} from '../../recoils/hero-write.recoil';
import {IMG_TYPE} from '../../constants/upload-file-type.constant';
import {WritingHeroType} from '../../types/writing-Hero.type';
import {PhotoIdentifier} from '@react-native-camera-roll/camera-roll';

export const useHeroHttpPayLoad = () => {
  const formData = new FormData();
  const writingHeroKey = useRecoilValue(writingHeroKeyState);
  const writingHero = useRecoilValue(writingHeroState);

  addHeroPhotoInFormData(formData, writingHero);
  addHeroInFormData(formData, writingHeroKey, writingHero);
  return formData;
};

const addHeroPhotoInFormData = function (
  formData: FormData,
  writingHero: WritingHeroType | undefined,
) {
  const photo = writingHero?.imageURL;
  if (photo) {
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
  const photo: PhotoIdentifier | undefined = writingHero?.imageURL;

  const currentTime = Date.now();
  const uri = photo?.node.image.uri;
  const fileParts = uri?.split('/');
  const imgName = fileParts ? fileParts[fileParts?.length - 1] : undefined;
  const imgPath = photo
    ? `${currentTime}_${String(imgName)}`
    : writingHero?.imageURL;

  const savedHero = {
    heroNo: writingHeroKey,
    heroName: writingHero?.heroName,
    heroNickName: writingHero?.heroNickName,
    birthday: writingHero?.birthday,
    title: writingHero?.title,
    imageURL: imgPath,
  };

  formData.append(writingHeroKey ? 'toUpdate' : 'toWrite', {
    string: JSON.stringify(savedHero),
    type: 'application/json',
  });
};
