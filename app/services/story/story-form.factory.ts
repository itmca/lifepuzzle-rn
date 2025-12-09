import { GalleryType, StoryType } from '../../types/core/media.type';
import {
  GalleryItem,
  WritingStoryType,
} from '../../types/core/writing-story.type';
import { ImageDimension } from '../../hooks/useImageDimensions';

/**
 * Factory for creating WritingStoryType objects
 * Centralizes story form initialization logic
 */
export const StoryFormFactory = {
  /**
   * Create WritingStory from a gallery item (for new story creation)
   *
   * @param galleryItem - Gallery item to create story from
   * @param dimensions - Optional image dimensions
   * @returns WritingStoryType object
   */
  fromGalleryItem(
    galleryItem: GalleryType,
    dimensions?: ImageDimension,
  ): WritingStoryType {
    const gallery: GalleryItem[] = [
      {
        id: galleryItem.id,
        uri: galleryItem.url,
        tagKey: galleryItem.tag.key,
        width: dimensions?.width,
        height: dimensions?.height,
      },
    ];

    return {
      gallery,
      date: galleryItem.story?.date,
    };
  },

  /**
   * Create WritingStory from existing story data (for editing)
   *
   * @param galleryItem - Gallery item containing the story
   * @param dimensions - Optional image dimensions
   * @returns WritingStoryType object with all story fields populated
   */
  fromExistingStory(
    galleryItem: GalleryType,
    dimensions?: ImageDimension,
  ): WritingStoryType {
    const story = galleryItem.story;

    const gallery: GalleryItem[] = [
      {
        id: galleryItem.id,
        uri: galleryItem.url,
        tagKey: galleryItem.tag.key,
        width: dimensions?.width,
        height: dimensions?.height,
      },
    ];

    return {
      title: story?.title ?? '',
      content: story?.content ?? '',
      date: story?.date ? new Date(story?.date) : new Date(),
      gallery,
      voice: story?.audios && story.audios.length > 0 ? story.audios[0] : '',
    };
  },

  /**
   * Create WritingStory from story data and separate gallery item
   * Used when story and gallery are provided separately
   *
   * @param story - Story data
   * @param galleryItem - Gallery item
   * @param dimensions - Optional image dimensions
   * @returns WritingStoryType object
   */
  fromStoryAndGallery(
    story: StoryType,
    galleryItem: GalleryType,
    dimensions?: ImageDimension,
  ): WritingStoryType {
    const gallery: GalleryItem[] = [
      {
        id: galleryItem.id,
        uri: galleryItem.url,
        tagKey: galleryItem.tag.key,
        width: dimensions?.width,
        height: dimensions?.height,
      },
    ];

    return {
      title: story.title,
      content: story.content,
      date: new Date(story.date),
      gallery,
      voice: story.audios && story.audios.length > 0 ? story.audios[0] : '',
    };
  },
} as const;
