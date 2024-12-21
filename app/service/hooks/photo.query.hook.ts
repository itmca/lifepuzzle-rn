import {useRecoilState, useRecoilValue} from 'recoil';
import {heroState} from '../../recoils/hero.recoil';
import {useUpdateObserver} from './update.hooks';
import {heroUpdate, storyListUpdate} from '../../recoils/update.recoil';
import {useEffect, useState} from 'react';
import {useAuthAxios} from './network.hook';
import {PhotoHeroType, AgeGroupsType, TagType} from '../../types/photo.type';
import {HeroType} from '../../types/hero.type';
import {
  ageGroupsState,
  selectedTagState,
  tagState,
} from '../../recoils/photos.recoil';
import {
  DUMMY_AGE_GROUPS,
  DUMMY_TAGS,
} from '../../constants/dummy-age-group.constant';
export type AgeGroupKeysWithoutTotalPhotos = Exclude<
  keyof AgeGroupsType,
  'totalGallery'
>;
type PhotoQueryResponse = {
  hero: PhotoHeroType;
  ageGroups: AgeGroupsType;
  tags: TagType[];
};

type Response = {
  photoHero: PhotoHeroType;
  ageGroups: AgeGroupsType;
  tags: TagType[];

  isLoading: boolean;
};
const tmpResponse: PhotoQueryResponse = {
  hero: {
    id: 20,
    name: '신사임당',
    nickname: '할머니',
    birthdate: '1941-01-23',
    age: 72,
    image:
      'https://pixabay.com/ko/photos/%EC%BF%A0%ED%82%A4-%EC%9A%B0%EC%9C%A0-%EC%B4%88%EC%BD%9C%EB%A0%9B-%EC%BF%A0%ED%82%A4-8394894/',
  },
  ageGroups: DUMMY_AGE_GROUPS,
  tags: DUMMY_TAGS,
};
export const useHeroPhotos = (): Response => {
  const hero = useRecoilValue<HeroType>(heroState);
  const heroUpdateObserver = useUpdateObserver(heroUpdate);
  const storyListUpdateObserver = useUpdateObserver(storyListUpdate);
  const [photoHero, setPhotoHero] = useState<PhotoHeroType>();
  const [ageGroups, setAgeGroups] =
    useRecoilState<AgeGroupsType>(ageGroupsState);
  const [tags, setTags] = useRecoilState<TagType[]>(tagState);
  const [selectedTag, setSelectedTag] =
    useRecoilState<TagType>(selectedTagState);
  const [isLoading, fetchHeroStories] = useAuthAxios<PhotoQueryResponse>({
    requestOption: {
      url: '/stories', // url: '/v1/heroes/{heroNo}/photos',
      params: {
        heroNo: hero.heroNo,
      },
    },
    onResponseSuccess: res => {
      setPhotoHero(tmpResponse.hero);
      setAgeGroups(tmpResponse.ageGroups);
      setTags([
        ...tmpResponse.tags.map(item => ({
          key: item.key,
          label: item.label,
          count:
            item.key in ageGroups
              ? ageGroups[item.key as AgeGroupKeysWithoutTotalPhotos]
                  ?.galleryCount
              : 0,
        })),
      ]);
      if (ageGroups.totalGallery == 0) {
        setSelectedTag(tags[(photoHero?.age ?? 0) / 10]);
      } else {
        setSelectedTag(tags[tags.findIndex(item => (item.count ?? 0) > 0)]);
      }
    },
    disableInitialRequest: true,
  });

  useEffect(() => {
    if (hero.heroNo < 0) {
      return;
    }

    fetchHeroStories({
      params: {
        heroNo: hero.heroNo,
      },
    });
  }, [hero.heroNo, heroUpdateObserver, storyListUpdateObserver]);

  return {
    photoHero,
    ageGroups,
    tags,
    isLoading,
  };
};
