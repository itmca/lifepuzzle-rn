import {AgeGroupsType, TagType} from '../types/photo.type';
import {StoryType} from '../types/story.type';

export const DUMMY_AGE_GROUPS: AgeGroupsType = {
  under10: {
    startYear: 1941,
    endYear: 1950,
    galleryCount: 1,
    gallery: [
      {
        id: 49,
        index: 1,
        type: 'photo',
        url: 'https://cdn.pixabay.com/photo/2023/01/08/18/11/plants-7705865_1280.jpg',
        story: {
          id: 31,
          title: '1.나는 수박이 제일 좋아',
          content: '맛\n좋\n은\n \n수\n박\n \n여\n름\n \n수\n박',
          audio:
            'https://lp-public.s3.ap-northeast-2.amazonaws.com/stories/26-123741/voice/2024.11.25 9:37PM.mp4',
          date: '1948-08-13',
        },
      },
    ],
  },
  '10s': {
    startYear: 1951,
    endYear: 1960,
    galleryCount: 2,
    gallery: [
      {
        id: 82,
        index: 2,
        type: 'photo',
        url: 'https://cdn.pixabay.com/photo/2023/01/08/18/11/plants-7705865_1280.jpg',
        story: {
          id: 31,
          title: '2.나는 수박이 제일 좋아',
          content: '맛 좋은 수박 여름 수박',
          audio: 'https://va.media.tumblr.com/tumblr_o600t8hzf51qcbnq0_480.mp4',
          date: '1948-08-13',
        },
      },
      {
        id: 21,
        index: 3,
        type: 'photo',
        url: 'https://cdn.pixabay.com/photo/2023/11/17/19/07/cookies-8394894_1280.jpg',
      },
    ],
  },
  '20s': {
    startYear: 1961,
    endYear: 1970,
    galleryCount: 3,
    gallery: [
      {
        id: 21,
        index: 4,
        type: 'photo',
        url: 'https://cdn.pixabay.com/photo/2023/11/17/19/07/cookies-8394894_1280.jpg',
      },
      {
        id: 9,
        index: 5,
        type: 'photo',
        url: 'https://cdn.pixabay.com/photo/2024/02/16/06/18/cat-8576777_1280.jpg',
      },
      {
        id: 9,
        index: 6,
        type: 'photo',
        url: 'https://cdn.pixabay.com/photo/2024/02/16/06/18/cat-8576777_1280.jpg',
      },
    ],
  },
  '30s': {
    startYear: 1971,
    endYear: 1980,
    galleryCount: 5,
    gallery: [
      {
        id: 4,
        index: 7,
        type: 'photo',
        url: 'https://cdn.pixabay.com/photo/2023/11/17/19/07/cookies-8394894_1280.jpg',
      },
      {
        id: 9,
        index: 8,
        type: 'photo',
        url: 'https://cdn.pixabay.com/photo/2024/02/16/06/18/cat-8576777_1280.jpg',
      },
      {
        id: 9,
        index: 9,
        type: 'photo',
        url: 'https://cdn.pixabay.com/photo/2024/02/16/06/18/cat-8576777_1280.jpg',
      },
      {
        id: 60,
        index: 10,
        type: 'photo',
        url: 'https://cdn.pixabay.com/photo/2023/01/08/18/11/plants-7705865_1280.jpg',
      },
      {
        id: 60,
        index: 11,
        type: 'photo',
        url: 'https://cdn.pixabay.com/photo/2023/01/08/18/11/plants-7705865_1280.jpg',
      },
    ],
  },
  '70s': {
    startYear: 2011,
    endYear: 2020,
    galleryCount: 1,
    gallery: [
      {
        id: 4,
        index: 12,
        type: 'photo',
        url: 'https://cdn.pixabay.com/photo/2024/02/16/06/18/cat-8576777_1280.jpg',
      },
    ],
  },
  totalGallery: 12,
};
export const DUMMY_TAGS: TagType[] = [
  {
    key: 'under10',
    label: '~10',
    count: 0,
  },
  {
    key: '10s',
    label: '10대',
    count: 10,
  },
  {
    key: '20s',
    label: '20대',
    count: 9,
  },
  {
    key: '30s',
    label: '30대',
    count: 8,
  },
  {
    key: '40s',
    label: '40대',
    count: 7,
  },
  {
    key: '50s',
    label: '50대',
    count: 6,
  },
  {
    key: '60s',
    label: '60대',
    count: 5,
  },
  {
    key: '70s',
    label: '70대',
    count: 4,
  },
];
