import { useUpdateObserver } from '../common/update.hook';
import { useEffect, useState } from 'react';
import { useAuthAxios } from '../core/auth-http.hook';
import { AgeGroupsType, TagKey, TagType } from '../../types/core/media.type';
import { useHeroStore } from '../../stores/hero.store';
import { useMediaStore } from '../../stores/media.store';
import { useSelectionStore } from '../../stores/selection.store';
import { AxiosRequestConfig } from 'axios';
import { toInternationalAge } from '../utils/date-time.service';

type PhotoQueryResponse = {
  ageGroups: AgeGroupsType;
  tags: TagType[];
  totalGallery: number;
};

type Response = {
  ageGroups: AgeGroupsType;
  tags: TagType[];

  isLoading: boolean;
  isError: boolean;
  hasInitialData: boolean;
  refetch: (newRequestOption: Partial<AxiosRequestConfig>) => void;
};

export const useHeroPhotos = (): Response => {
  const hero = useHeroStore(state => state.currentHero);
  const heroUpdateObserver = useUpdateObserver('heroUpdate');
  const storyListUpdateObserver = useUpdateObserver('storyListUpdate');
  const ageGroups = useMediaStore(state => state.ageGroups);
  const tags = useMediaStore(state => state.tags);
  const setAgeGroups = useMediaStore(state => state.setAgeGroups);
  const setTags = useMediaStore(state => state.setTags);
  const setSelectedTag = useSelectionStore(state => state.setSelectedTag);
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
      if (res) {
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

        const heroAge = hero ? toInternationalAge(hero.birthday) : 0;
        if (res.totalGallery === 0) {
          const index =
            Math.trunc(heroAge / 10) +
            newTags.filter(item => item.key === 'AI_PHOTO').length;
          setSelectedTag({ ...res.tags[index ?? 0] });
        } else {
          const index = newTags.findIndex(item => (item.count ?? 0) > 0);
          setSelectedTag({ ...newTags[index ?? 0] });
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
      return;
    }

    setIsError(false);
    fetchHeroStories({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hero?.heroNo, heroUpdateObserver, storyListUpdateObserver]);

  return {
    ageGroups: ageGroups || {},
    tags: tags || [],
    isLoading,
    isError,
    hasInitialData,
    refetch: fetchHeroStories,
  };
};
