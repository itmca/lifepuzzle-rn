/**
 * TanStack Query의 Query Key를 중앙에서 관리
 *
 * 장점:
 * - 타입 안전성 향상
 * - 캐시 무효화 시 일관된 키 사용
 * - 한곳에서 모든 query key 파악 가능
 */

export const queryKeys = {
  hero: {
    all: ['heroes'] as const,
    lists: () => [...queryKeys.hero.all, 'list'] as const,
    list: (filters?: string) =>
      [...queryKeys.hero.lists(), { filters }] as const,
    details: () => [...queryKeys.hero.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.hero.details(), id] as const,
  },
  gallery: {
    all: ['galleries'] as const,
    lists: () => [...queryKeys.gallery.all, 'list'] as const,
    list: (heroId: number, updateObservers?: any) =>
      [...queryKeys.gallery.lists(), heroId, updateObservers] as const,
  },
  ai: {
    all: ['ai'] as const,
    templates: () => [...queryKeys.ai.all, 'templates'] as const,
    galleries: (heroId?: number) =>
      [...queryKeys.ai.all, 'galleries', heroId] as const,
  },
  share: {
    all: ['share'] as const,
    hero: (code: string) => [...queryKeys.share.all, 'hero', code] as const,
  },
} as const;
