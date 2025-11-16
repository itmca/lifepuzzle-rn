// Temporary polyfill to replace all remaining Recoil usage
// This allows the app to compile while we identify what needs to be migrated

// Import our existing stores to provide actual functionality where possible
import {useAuthStore} from '../stores/auth.store';
import {useUserStore} from '../stores/user.store';
import {useHeroStore} from '../stores/hero.store';
import {useStoryStore} from '../stores/story.store';
import {useMediaStore} from '../stores/media.store';
import {useSelectionStore} from '../stores/selection.store';
import {useShareStore} from '../stores/share.store';
import {useUIStore} from '../stores/ui.store';
import {useCacheStore} from '../stores/cache.store';

// Map old Recoil state names to new Zustand store accessors
const stateMap: any = {
  // Auth states
  authState: () => useAuthStore(state => state.authTokens),
  isLoggedInState: () => useAuthStore(state => state.isLoggedIn()),
  userState: () => useUserStore(state => state.user),
  writingUserState: () => useUserStore(state => state.writingUser),

  // Hero states
  heroState: () => useHeroStore(state => state.currentHero),
  writingHeroState: () => useHeroStore(state => state.writingHero),
  writingHeroKeyState: () => useHeroStore(state => state.writingHeroKey),

  // Story states
  writingStoryState: () => useStoryStore(state => state.writingStory),
  selectedStoryKeyState: () => useStoryStore(state => state.selectedStoryKey),
  playInfoState: () => useStoryStore(state => state.playInfo),
  postStoryKeyState: () => useStoryStore(state => state.postStoryKey),

  // Media states
  ageGroupsState: () => useMediaStore(state => state.ageGroups),
  tagState: () => useMediaStore(state => state.tags),
  galleryErrorState: () => useMediaStore(state => state.galleryError),

  // UI states
  uploadState: () => useUIStore(state => state.uploadState),
  selectionState: () => ({
    tag: useSelectionStore(state => state.selectedTag),
    gallery: useSelectionStore(state => state.selectedGalleryItems),
    editedGallery: useSelectionStore(state => state.editGalleryItems),
    hero: useSelectionStore(state => state.selectedHeroPhoto),
    user: useSelectionStore(state => state.selectedUserPhoto),
  }),
  modalState: () => useUIStore(state => state.isModalOpening),
  OpenDetailBottomSheet: () => useUIStore(state => state.openDetailBottomSheet),

  // Share states
  shareKeyState: () => useShareStore(state => state.shareKey),
  sharedImageDataState: () => useShareStore(state => state.sharedImageData),

  // Cache states
  heroUpdate: () => useCacheStore(state => state.heroUpdate),
  storyListUpdate: () => useCacheStore(state => state.storyListUpdate),
  userUpdate: () => useCacheStore(state => state.userUpdate),
};

const setterMap: any = {
  // Auth setters
  authState: () => useAuthStore(state => state.setAuthTokens),
  userState: () => useUserStore(state => state.setUser),
  writingUserState: () => useUserStore(state => state.setWritingUser),

  // Hero setters
  heroState: () => useHeroStore(state => state.setCurrentHero),
  writingHeroState: () => useHeroStore(state => state.setWritingHero),
  writingHeroKeyState: () => useHeroStore(state => state.setWritingHeroKey),

  // Story setters
  writingStoryState: () => useStoryStore(state => state.setWritingStory),
  selectedStoryKeyState: () =>
    useStoryStore(state => state.setSelectedStoryKey),
  playInfoState: () => useStoryStore(state => state.setPlayInfo),
  postStoryKeyState: () => useStoryStore(state => state.setPostStoryKey),

  // Media setters
  ageGroupsState: () => useMediaStore(state => state.setAgeGroups),
  tagState: () => useMediaStore(state => state.setTags),

  // UI setters
  uploadState: () => useUIStore(state => state.setUploadState),
  OpenDetailBottomSheet: () =>
    useUIStore(state => state.setOpenDetailBottomSheet),

  // Share setters
  shareKeyState: () => useShareStore(state => state.setShareKey),
  sharedImageDataState: () => useShareStore(state => state.setSharedImageData),
};

// Polyfill hooks
export const useRecoilValue = (state: any) => {
  if (stateMap[state?.key]) {
    return stateMap[state.key]();
  }
  console.warn('Unmapped useRecoilValue:', state);
  return null;
};

export const useRecoilState = (state: any): [any, any] => {
  const value = stateMap[state?.key] ? stateMap[state.key]() : null;
  const setter = setterMap[state?.key] ? setterMap[state.key]() : () => {};

  if (!stateMap[state?.key]) {
    console.warn('Unmapped useRecoilState:', state);
  }

  return [value, setter];
};

export const useSetRecoilState = (state: any) => {
  if (setterMap[state?.key]) {
    return setterMap[state.key]();
  }
  console.warn('Unmapped useSetRecoilState:', state);
  return () => {};
};

export const useResetRecoilState = (state: any) => {
  // Map to appropriate reset functions
  const resetMap: any = {
    authState: () => useAuthStore(state => state.clearAuth),
    userState: () => useUserStore(state => state.resetUser),
    writingUserState: () => useUserStore(state => state.resetWritingUser),
    heroState: () => useHeroStore(state => state.resetHero),
    writingHeroState: () => useHeroStore(state => state.resetWritingHero),
    writingStoryState: () => useStoryStore(state => state.resetWritingStory),
    playInfoState: () => useStoryStore(state => state.resetPlayInfo),
    selectionState: () => useSelectionStore(state => state.resetSelection),
    shareKeyState: () => useShareStore(state => state.resetShare),
  };

  if (resetMap[state?.key]) {
    return resetMap[state.key]();
  }

  console.warn('Unmapped useResetRecoilState:', state);
  return () => {};
};
