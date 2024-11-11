import {StoryType} from '../types/story.type';

export const DUMMY_STORY_LIST: StoryType[] = [
  {
    id: '999-1',
    heroNo: -1,
    title: '땅을 파보니 보석이 있었지',
    content:
      '결혼 전에는 아내가 나를 별로 안 좋아 했었어.\n' +
      '나랑 왜 결혼했는지 궁금했을 정도 였거든.\n' +
      '\n' +
      '그런데 결혼 후에는 나를 많이 사랑해주더라고.\n' +
      '그렇지 않아도 괜찮았는데 땅을 파보니 보석이 있었던 거지.',
    audios: [],
    videos: [
      'https://lp-public.s3.ap-northeast-2.amazonaws.com/not-login-stories/family.mp4',
    ],
    photos: [
      'https://lp-public.s3.ap-northeast-2.amazonaws.com/not-login-stories/couple.jpg',
    ],
    question: '신혼 시절은 어떠셨나요?',
    tags: [],
    createdAt: new Date('2023-06-02T03:29:16.000Z'),
    date: new Date('2022-10-01T00:00:00.000Z'),
  },
  {
    id: '999-2',
    heroNo: -1,
    title: '1학년 때 소풍',
    content:
      '1학년 때 갔던 소풍이 가장 기억에 남아.\n' +
      '친구들이랑 김밥도 같이 먹고 술래잡기도 하고 보물찾기도 했어.\n' +
      '\n' +
      '소풍 끝나고는 근처 유명한 콩국수 집 가서 콩국수를 먹었던 것 같은데\n' +
      '아직도 그 집이 있을지 모르겠네',
    audios: [
      'https://lp-public.s3.ap-northeast-2.amazonaws.com/not-login-stories/holiday.mp3',
    ],
    videos: [],
    photos: [
      'https://lp-public.s3.ap-northeast-2.amazonaws.com/not-login-stories/picnic.jpg',
    ],
    question: '중학교 때 가장 재미있었던 기억은?',
    tags: [],
    createdAt: new Date('2023-06-02T03:29:16.000Z'),
    date: new Date('2023-12-30T00:00:00.000Z'),
  },
  {
    id: '999-3',
    heroNo: -1,
    title: '책임을 지다보면 실력이 생긴다',
    content:
      '존경하는 분께서 해주신 이야기인데\n' +
      '실력이 있어서 책임지는 것이 아니라 책임을 지다보니 실력이 생긴다고 하더라고\n' +
      '이게 참 마음에 많이 와 닿았어',
    audios: [],
    videos: [],
    photos: [],
    question: '인생의 좌우명은?',
    createdAt: new Date('2023-06-02T03:29:16.000Z'),
    date: new Date('2023-12-30T00:00:00.000Z'),
    tags: [],
  },
  {
    id: '999-4',
    heroNo: -1,
    title: '평양냉면',
    content:
      '일반 냉면도 맛있지만 평양냉면을 자주 먹었지\n' +
      '가격이 비싸서 좀 그렇기를 해도 내 입맛에 딱 맞더라고',
    audios: [],
    videos: [],
    photos: [
      'https://lp-public.s3.ap-northeast-2.amazonaws.com/not-login-stories/nk-noodle1.jpg',
      'https://lp-public.s3.ap-northeast-2.amazonaws.com/not-login-stories/nk-noodle2.jpg',
    ],
    question: '여름마다 즐겨 먹던 음식은?',
    createdAt: new Date('2023-06-02T03:29:16.000Z'),
    date: new Date('2023-12-30T00:00:00.000Z'),
    tags: [],
  },
];
