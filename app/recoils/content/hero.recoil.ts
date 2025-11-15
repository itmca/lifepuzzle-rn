import {atom} from 'recoil';
import {HeroType} from '../../types/hero.type';
import {selectedHeroPhotoState} from '../ui/selection.recoil';

export const heroState = atom<HeroType | null>({
  key: 'heroState',
  default: null,
});

// Re-export for backward compatibility
export {selectedHeroPhotoState};
