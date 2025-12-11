import { useUpdateObserver } from '../common/update.hook.ts';
import { useEffect, useMemo, useState } from 'react';
import { AgeGroupsType, TagKey, TagType } from '../../types/core/media.type.ts';
import { useHeroStore } from '../../stores/hero.store.ts';
import { useMediaStore } from '../../stores/media.store.ts';
import { useSelectionStore } from '../../stores/selection.store.ts';
import { toInternationalAge } from '../../utils/age-calculator.util.ts';
import { useAuthQuery } from '../core/auth-query.hook.ts';
import logger from '../../utils/logger.util.ts';

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
  refetch: () => void;
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
  const queryEnabled = useMemo(() => Boolean(hero && hero.id >= 0), [hero?.id]);

  const {
    data,
    isFetching,
    isLoading,
    isError: queryError,
    refetch,
  } = useAuthQuery<PhotoQueryResponse>({
    queryKey: [
      'galleries',
      hero?.id,
      heroUpdateObserver,
      storyListUpdateObserver,
    ],
    axiosConfig: {
      url: '/v1/galleries',
      params: {
        heroNo: hero?.id || -1,
      },
    },
    enabled: queryEnabled,
  });

  useEffect(() => {
    if (!data) {
      return;
    }

    logger.debug('[useHeroPhotos] onResponseSuccess called');
    setAgeGroups(data.ageGroups);
    const newTags = [
      ...data.tags.map(item => ({
        key: item.key,
        label: item.label,
        count:
          item.key in data.ageGroups
            ? data.ageGroups[item.key as TagKey]?.galleryCount
            : 0,
      })),
    ];
    setTags(newTags);

    const heroAge = hero ? toInternationalAge(hero.birthday) : 0;
    if (data.totalGallery === 0) {
      const index =
        Math.trunc(heroAge / 10) +
        newTags.filter(item => item.key === 'AI_PHOTO').length;
      setSelectedTag({ ...data.tags[index ?? 0] });
    } else {
      const index = newTags.findIndex(item => (item.count ?? 0) > 0);
      setSelectedTag({ ...newTags[index ?? 0] });
    }

    setIsError(false);
    logger.debug('[useHeroPhotos] Data loaded successfully');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, hero?.birthday]);

  useEffect(() => {
    if (queryError) {
      logger.error('[useHeroPhotos] onError called', queryError);
      setIsError(true);
    }
  }, [queryError]);

  return {
    ageGroups: ageGroups || {},
    tags: tags || [],
    isLoading: isLoading || isFetching,
    isError,
    hasInitialData: Boolean(data),
    refetch,
  };
};
