import { StoryType } from '../types/core/story.type';
import { GalleryType } from '../types/core/media.type';
import { HeroType } from '../types/core/hero.type';

/**
 * Story 객체 생성 또는 업데이트
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
 * const updatedStory = createOrUpdateStory(
 *   'story-123',
 *   '오늘 공원에서 놀았어요',
 *   currentGalleryItem,
 *   currentHero
 * );
 */
export const createOrUpdateStory = (
  storyKey: string,
  content: string,
  galleryItem: GalleryType,
  currentHero: HeroType,
): StoryType => {
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
};
