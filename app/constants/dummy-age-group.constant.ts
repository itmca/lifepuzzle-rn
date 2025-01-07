import {AgeGroupsType, TagType} from '../types/photo.type';

export const DUMMY_AGE_GROUPS: AgeGroupsType = {
  UNDER_TEENAGER: {
    startYear: 1941,
    endYear: 1950,
    galleryCount: 1,
    gallery: [
      {
        id: 49,
        index: 1,
        type: 'IMAGE',
        url: 'https://item.kakaocdn.net/do/1401e813472967e3b572fee1ee192eb89f17e489affba0627eb1eb39695f93dd',
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
  TEENAGER: {
    startYear: 1951,
    endYear: 1960,
    galleryCount: 2,
    gallery: [
      {
        id: 82,
        index: 2,
        type: 'VIDEO',
        url: 'https://va.media.tumblr.com/tumblr_o600t8hzf51qcbnq0_480.mp4',
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
        type: 'IMAGE',
        url: 'https://cdn.pixabay.com/photo/2023/11/17/19/07/cookies-8394894_1280.jpg',
      },
    ],
  },
  TWENTIES: {
    startYear: 1961,
    endYear: 1970,
    galleryCount: 3,
    gallery: [
      {
        id: 21,
        index: 4,
        type: 'IMAGE',
        url: 'https://cdn.pixabay.com/photo/2023/11/17/19/07/cookies-8394894_1280.jpg',
      },
      {
        id: 9,
        index: 5,
        type: 'IMAGE',
        url: 'https://cdn.pixabay.com/photo/2024/02/16/06/18/cat-8576777_1280.jpg',
      },
      {
        id: 9,
        index: 6,
        type: 'IMAGE',
        url: 'https://cdn.pixabay.com/photo/2024/02/16/06/18/cat-8576777_1280.jpg',
      },
    ],
  },
  THIRTY: {
    startYear: 1971,
    endYear: 1980,
    galleryCount: 5,
    gallery: [
      {
        id: 4,
        index: 7,
        type: 'IMAGE',
        url: 'https://cdn.pixabay.com/photo/2023/11/17/19/07/cookies-8394894_1280.jpg',
      },
      {
        id: 9,
        index: 8,
        type: 'IMAGE',
        url: 'https://cdn.pixabay.com/photo/2024/02/16/06/18/cat-8576777_1280.jpg',
      },
      {
        id: 9,
        index: 9,
        type: 'IMAGE',
        url: 'https://cdn.pixabay.com/photo/2024/02/16/06/18/cat-8576777_1280.jpg',
      },
      {
        id: 60,
        index: 10,
        type: 'IMAGE',
        url: 'https://cdn.pixabay.com/photo/2023/01/08/18/11/plants-7705865_1280.jpg',
      },
      {
        id: 60,
        index: 11,
        type: 'IMAGE',
        url: 'https://cdn.pixabay.com/photo/2023/01/08/18/11/plants-7705865_1280.jpg',
      },
    ],
  },
  SEVENTY: {
    startYear: 2011,
    endYear: 2020,
    galleryCount: 1,
    gallery: [
      {
        id: 4,
        index: 12,
        type: 'IMAGE',
        url: 'https://cdn.pixabay.com/photo/2024/02/16/06/18/cat-8576777_1280.jpg',
      },
    ],
  },
};
export const DUMMY_TAGS: TagType[] = [
  {
    key: 'UNDER_TEENAGER',
    label: '10대 미만',
  },
  {
    key: 'TEENAGER',
    label: '10대',
  },
  {
    key: 'TWENTIES',
    label: '20대',
  },
  {
    key: 'THIRTY',
    label: '30대',
  },
  {
    key: 'FORTY',
    label: '40대',
  },
  {
    key: 'FIFTY',
    label: '50대',
  },
  {
    key: 'SIXTY',
    label: '60대',
  },
  {
    key: 'SEVENTY',
    label: '70대',
  },
  {
    key: 'EIGHTY',
    label: '80대',
  },
];
