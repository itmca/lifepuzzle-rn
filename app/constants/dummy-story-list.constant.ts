import {StoryType} from '../types/story.type';

export const DUMMY_STORY_LIST: StoryType[] = [
  {
    id: '999-1',
    heroNo: -1,
    title: '테스트 제목입니다. 테스트 제목입니다.',
    content:
      '테스트 내용입니다. 테스트 내용입니다. 테스트 내용입니다. 테스트 내용입니다. 테스트 내용입니다. 테스트 내용입니다. ',
    audios: [],
    videos: [
      'https://itmca-public.s3.ap-northeast-2.amazonaws.com/stories/49-232743/video/VID_20230717_224732.mp4',
    ],
    photos: [],
    question: '',
    tags: [],
    createdAt: new Date('2023-06-02T03:29:16.000Z'),
    date: new Date('2023-12-30T00:00:00.000Z'),
  },
  {
    id: '999-2',
    heroNo: -1,
    title: '더미 데이터 내용 정리되면 변경할 영역입니다.',
    content:
      '테스트 내용입니다. 테스트 내용입니다. 테스트 내용입니다. 테스트 내용입니다. 테스트 내용입니다. 테스트 내용입니다. ',
    audios: [],
    videos: [],
    photos: [],
    question: '',
    tags: [],
    createdAt: new Date('2023-06-02T03:29:16.000Z'),
    date: new Date('2023-12-30T00:00:00.000Z'),
  },
  {
    id: '999-3',
    heroNo: -1,
    title: '테스트 제목입니다. 테스트 제목입니다.',
    content:
      '테스트 내용입니다. 테스트 내용입니다. 테스트 내용입니다. 테스트 내용입니다. 테스트 내용입니다. 테스트 내용입니다. ',
    audios: [],
    videos: [],
    photos: [],
    question: '',
    createdAt: new Date('2023-06-02T03:29:16.000Z'),
    date: new Date('2023-12-30T00:00:00.000Z'),
    tags: [],
  },
];
