import {useRecoilState, useSetRecoilState} from 'recoil';
import {heroState} from '../../recoils/content/hero.recoil';
import {useUpdateObserver} from './update.hooks';
import {heroUpdate, storyListUpdate} from '../../recoils/shared/cache.recoil';
import {useEffect, useState} from 'react';
import {useAuthAxios} from './network.hook';
import {
  AgeGroupsType,
  PhotoHeroType,
  TagKey,
  TagType,
} from '../../types/photo.type';
import {HeroType} from '../../types/hero.type';
import {
  ageGroupsState,
  selectedTagState,
  tagState,
} from '../../recoils/content/media.recoil';
import {AxiosRequestConfig} from 'axios';
import {toInternationalAge} from '../date-time-display.service';

type PhotoQueryResponse = {
  hero: PhotoHeroType;
  ageGroups: AgeGroupsType;
  tags: TagType[];
  totalGallery: number;
};

type Response = {
  photoHero: PhotoHeroType;
  ageGroups: AgeGroupsType;
  tags: TagType[];

  isLoading: boolean;
  isError: boolean;
  hasInitialData: boolean;
  refetch: (newRequestOption: Partial<AxiosRequestConfig>) => void;
};

export const useHeroPhotos = (): Response => {
  const [hero] = useRecoilState<HeroType | null>(heroState);
  const heroUpdateObserver = useUpdateObserver(heroUpdate);
  const storyListUpdateObserver = useUpdateObserver(storyListUpdate);
  const [photoHero, setPhotoHero] = useState<PhotoHeroType>({
    id: hero?.heroNo || -1,
    name: hero?.heroName || '',
    nickname: hero?.heroNickName || '',
    birthdate: hero?.birthday?.toDateString() || '',
    age: hero ? toInternationalAge(hero.birthday) : 0,
    image: hero?.imageURL ?? '',
  });
  const [ageGroups, setAgeGroups] =
    useRecoilState<AgeGroupsType>(ageGroupsState);
  const [tags, setTags] = useRecoilState<TagType[]>(tagState);
  const setSelectedTag = useSetRecoilState<TagType>(selectedTagState);
  const [isError, setIsError] = useState<boolean>(false);
  const [hasInitialData, setHasInitialData] = useState<boolean>(false);
  const [isLoading, fetchHeroStories] = useAuthAxios<PhotoQueryResponse>({
    requestOption: {
      url: '/v1/galleries',
      params: {
        heroNo: hero?.heroNo || -1,
      },
    },
    onResponseSuccess: res => {
      if (res && res.hero) {
        setPhotoHero(res.hero);
        setAgeGroups(res.ageGroups);
        const newTags = [
          ...res.tags.map(item => ({
            key: item.key,
            label: item.label,
            count:
              item.key in res.ageGroups
                ? res.ageGroups[item.key as TagKey]?.galleryCount
                : 0,
          })),
        ];
        setTags(newTags);

        if (res.totalGallery === 0) {
          const index =
            Math.trunc((res.hero.age ?? 0) / 10) +
            newTags.filter(item => item.key === 'AI_PHOTO').length;
          setSelectedTag({...res.tags[index ?? 0]});
        } else {
          const index = newTags.findIndex(item => (item.count ?? 0) > 0);
          setSelectedTag({...newTags[index ?? 0]});
        }

        setIsError(false);
        setHasInitialData(true);
      }
    },
    onError: () => {
      setIsError(true);
    },
    disableInitialRequest: true,
  });

  useEffect(() => {
    if (!hero || hero.heroNo < 0) {
      // TODO(border-line): hero 정보가 없을 때 처리 개선
      setPhotoHero({
        id: hero?.heroNo || -1,
        name: hero?.heroName || '',
        nickname: hero?.heroNickName || '',
        birthdate: '',
        age: -1,
        image: '',
      });
      return;
    }

    setIsError(false);
    fetchHeroStories({});
  }, [hero?.heroNo, heroUpdateObserver, storyListUpdateObserver]);

  return {
    photoHero,
    ageGroups,
    tags,
    isLoading,
    isError,
    hasInitialData,
    refetch: fetchHeroStories,
  };
};
