import { GalleryType } from '../../types/core/media.type';
import { ImageDimension } from '../../hooks/useImageDimensions';
import { BasicNavigationProps } from '../../navigation/types';
import { useStoryStore } from '../../stores/story.store';
import { StoryFormFactory } from './story-form.factory';

/**
 * Service for story-related navigation
 * Centralizes navigation logic and story initialization
 */
export class StoryNavigationService {
  /**
   * Navigate to story writing page for creating a new story
   *
   * @param navigation - Navigation object
   * @param galleryItem - Gallery item to create story from
   * @param dimensions - Optional image dimensions
   */
  static navigateToWrite(
    navigation: BasicNavigationProps,
    galleryItem: GalleryType,
    dimensions?: ImageDimension,
  ): void {
    const { resetSelectedStoryKey, setWritingStory } = useStoryStore.getState();

    resetSelectedStoryKey();
    const writingStory = StoryFormFactory.fromGalleryItem(
      galleryItem,
      dimensions,
    );
    setWritingStory(writingStory);

    navigation.navigate('App', {
      screen: 'StoryWritingNavigator',
      params: {
        screen: 'StoryWritingMain',
      },
    });
  }

  /**
   * Navigate to story writing page for editing an existing story
   *
   * @param navigation - Navigation object
   * @param galleryItem - Gallery item containing the story
   * @param dimensions - Optional image dimensions
   */
  static navigateToEdit(
    navigation: BasicNavigationProps,
    galleryItem: GalleryType,
    dimensions?: ImageDimension,
  ): void {
    const { setWritingStory, setSelectedStoryKey } = useStoryStore.getState();

    const writingStory = StoryFormFactory.fromExistingStory(
      galleryItem,
      dimensions,
    );
    setWritingStory(writingStory);
    setSelectedStoryKey(galleryItem.story?.id ?? '');

    navigation.navigate('App', {
      screen: 'StoryWritingNavigator',
      params: {
        screen: 'StoryWritingMain',
      },
    });
  }
}
