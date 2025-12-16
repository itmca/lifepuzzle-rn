import { useEffect, useState } from 'react';
import { AgeGroupsType, TagKey, TagType } from '../../types/core/media.type';
import { AiGallery, AiPhotoTemplate } from '../../types/external/ai-photo.type';
import { useHeroStore } from '../../stores/hero.store';
import { useMediaStore } from '../../stores/media.store';
import { useSelectionStore } from '../../stores/selection.store';
import { toInternationalAge } from '../../utils/age-calculator.util';
import { useAuthQuery } from '../core/auth-query.hook';
import { useUpdateObserver } from '../common/cache-observer.hook';
import { queryKeys } from '../core/query-keys';
import logger from '../../utils/logger.util';

type PhotoQueryResponse = {
  ageGroups: AgeGroupsType;
  tags: TagType[];
  totalGallery: number;
};

export type UseGalleriesReturn = {
  ageGroups: AgeGroupsType;
  tags: TagType[];
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  hasInitialData: boolean;
  refetch: () => void;
};

export const useGalleries = (): UseGalleriesReturn => {
  const hero = useHeroStore(state => state.currentHero);
  const heroUpdateObserver = useUpdateObserver('heroUpdate');
  const storyListUpdateObserver = useUpdateObserver('storyListUpdate');
  const ageGroups = useMediaStore(state => state.ageGroups);
  const tags = useMediaStore(state => state.tags);
  const setAgeGroups = useMediaStore(state => state.setAgeGroups);
  const setTags = useMediaStore(state => state.setTags);
  const selectedTag = useSelectionStore(state => state.selectedTag);
  const setSelectedTag = useSelectionStore(state => state.setSelectedTag);
  const [isError, setIsError] = useState<boolean>(false);

  const query = useAuthQuery<PhotoQueryResponse>({
    queryKey: queryKeys.gallery.list(hero?.id ?? -1, {
      heroUpdateObserver,
      storyListUpdateObserver,
    }),
    axiosConfig: {
      url: '/v1/galleries',
      params: {
        heroNo: hero?.id || -1,
      },
    },
    enabled: Boolean(hero && hero.id >= 0),
  });

  useEffect(() => {
    if (!query.data) {
      return;
    }

    setAgeGroups(query.data.ageGroups);
    const newTags = [
      ...query.data.tags.map(item => ({
        key: item.key,
        label: item.label,
        count:
          item.key in query.data.ageGroups
            ? query.data.ageGroups[item.key as TagKey]?.galleryCount
            : 0,
      })),
    ];
    setTags(newTags);

    // Only set selectedTag if it's not already set or if current selection is invalid
    const isCurrentTagValid =
      selectedTag && newTags.some(tag => tag.key === selectedTag.key);

    if (!isCurrentTagValid) {
      const heroAge = hero ? toInternationalAge(hero.birthday) : 0;
      if (query.data.totalGallery === 0) {
        const index =
          Math.trunc(heroAge / 10) +
          newTags.filter(item => item.key === 'AI_PHOTO').length;
        setSelectedTag({ ...query.data.tags[index ?? 0] });
      } else {
        const index = newTags.findIndex(item => (item.count ?? 0) > 0);
        setSelectedTag({ ...newTags[index ?? 0] });
      }
    }

    setIsError(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.data, hero?.birthday]);

  useEffect(() => {
    if (query.isError) {
      logger.error('[useGalleries] Query error', query.error);
      setIsError(true);
    }
  }, [query.isError, query.error]);

  return {
    ageGroups: ageGroups || {},
    tags: tags || [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError,
    hasInitialData: Boolean(query.data),
    refetch: query.refetch,
  };
};

interface AiPhotoTemplateQueryResponse {
  drivingVideos: AiPhotoTemplate[];
}

export type UseAiPhotoTemplatesReturn = {
  drivingVideos: AiPhotoTemplate[];
  isLoading: boolean;
  refetch: () => void;
};

export const useAiPhotoTemplates = (): UseAiPhotoTemplatesReturn => {
  const query = useAuthQuery<AiPhotoTemplateQueryResponse>({
    queryKey: queryKeys.ai.templates(),
    axiosConfig: {
      method: 'GET',
      url: '/v1/ai/driving-videos',
    },
  });

  return {
    drivingVideos: query.data?.drivingVideos ?? [],
    isLoading: query.isFetching,
    refetch: query.refetch,
  };
};

interface AiGalleriesQueryResponse {
  gallery: AiGallery[];
}

export type UseAiGalleriesReturn = {
  gallery: AiGallery[];
  isLoading: boolean;
  refetch: () => void;
};

export const useAiGalleries = (): UseAiGalleriesReturn => {
  const hero = useHeroStore(state => state.currentHero);

  const query = useAuthQuery<AiGalleriesQueryResponse>({
    queryKey: queryKeys.ai.galleries(hero?.id),
    axiosConfig: {
      method: 'GET',
      url: `/v1/galleries/ai?heroId=${hero?.id || 0}`,
    },
    enabled: Boolean(hero?.id),
  });

  return {
    gallery: query.data?.gallery ?? [],
    isLoading: query.isFetching,
    refetch: query.refetch,
  };
};
