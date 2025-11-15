import {atom} from 'recoil';
import {PhotoIdentifier} from '@react-native-camera-roll/camera-roll';
import {TagType} from '../../types/photo.type';

export type SelectionStateType = {
  user?: PhotoIdentifier;
  hero?: PhotoIdentifier;
  gallery: PhotoIdentifier[];
  editedGallery: PhotoIdentifier[];
  currentGalleryIndex: number;
  tag: TagType | null;
};

export const selectionState = atom<SelectionStateType>({
  key: 'selectionState',
  default: {
    gallery: [],
    editedGallery: [],
    currentGalleryIndex: 0,
    tag: null,
  },
});
