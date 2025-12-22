import { StoryType } from '../../types/core/story.type';
import { GalleryType } from '../../types/core/media.type';
import { HeroType } from '../../types/core/hero.type';
import { WritingStoryType } from '../../types/core/writing-story.type';

/**
 * Story 모델 생성 및 변환 서비스
 *
 * Story 객체를 생성하거나 업데이트하는 비즈니스 로직을 담당합니다.
 */
export const StoryModelService = {
  /**
   * Gallery 아이템과 content를 기반으로 Story 객체 생성 또는 업데이트
   *
   * 기존 story가 있으면 업데이트, 없으면 새로 생성합니다.
   * content만 변경하고 나머지 필드는 기존 값 유지합니다.
   *
   * @param storyKey Story ID (서버에서 반환된 key)
   * @param content 저장할 story content
   * @param galleryItem 연결된 갤러리 아이템
   * @param currentHero 현재 히어로 정보
   * @returns 생성 또는 업데이트된 StoryType 객체
   *
   * @example
   * const updatedStory = StoryModelService.createFromGallery(
   *   'story-123',
   *   '오늘 공원에서 놀았어요',
   *   currentGalleryItem,
   *   currentHero
   * );
   */
  createFromGallery(
    storyKey: string,
    content: string,
    galleryItem: GalleryType,
    currentHero: HeroType,
  ): StoryType {
    const baseStory = galleryItem.story;

    return {
      id: storyKey,
      heroId: currentHero.id ?? baseStory?.heroId ?? 0,
      content: content,
      question: baseStory?.question ?? '',
      photos: baseStory?.photos ?? [],
      audios: baseStory?.audios ?? [],
      videos: baseStory?.videos ?? [],
      gallery: baseStory?.gallery ?? [],
      tags: baseStory?.tags ?? [],
      date: galleryItem.date ?? baseStory?.date ?? new Date(),
      createdAt: baseStory?.createdAt ?? new Date(),
      recordingTime: baseStory?.recordingTime,
      playingTime: baseStory?.playingTime,
    };
  },

  /**
   * WritingStory 데이터를 기반으로 Story 객체 생성 또는 업데이트
   *
   * useSaveStory에서 사용하는 패턴으로, writingStory store의 데이터와
   * 타겟 갤러리 아이템을 기반으로 StoryType 객체를 생성합니다.
   *
   * @param storyId Story ID
   * @param writingStory 작성 중인 story 데이터
   * @param targetGallery 연결된 갤러리 아이템
   * @param hero 현재 히어로 정보
   * @returns 생성 또는 업데이트된 StoryType 객체
   *
   * @example
   * const updatedStory = StoryModelService.createFromWritingStory(
   *   storyKey,
   *   writingStory,
   *   targetGallery,
   *   hero
   * );
   */
  createFromWritingStory(
    storyId: string,
    writingStory: WritingStoryType,
    targetGallery: GalleryType | undefined,
    hero: HeroType | null | undefined,
  ): StoryType {
    const baseStory = targetGallery?.story;

    return {
      id: storyId,
      heroId: hero?.id ?? baseStory?.heroId ?? 0,
      content: writingStory.content ?? baseStory?.content ?? '',
      question: baseStory?.question ?? '',
      photos: baseStory?.photos ?? [],
      audios: writingStory.voice
        ? [writingStory.voice]
        : (baseStory?.audios ?? []),
      videos: baseStory?.videos ?? [],
      gallery: baseStory?.gallery ?? [],
      tags: baseStory?.tags ?? [],
      date: writingStory.date ?? baseStory?.date ?? new Date(),
      createdAt: baseStory?.createdAt ?? new Date(),
      recordingTime: baseStory?.recordingTime,
      playingTime: baseStory?.playingTime,
    };
  },
} as const;
