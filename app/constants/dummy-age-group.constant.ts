import {AgeGroupsType, TagType} from '../types/photo.type';

export const DUMMY_AGE_GROUPS: AgeGroupsType = {
  UNDER_TEENAGER: {
    startYear: 1957,
    endYear: 1966,
    galleryCount: 1,
    gallery: [
      {
        id: 1,
        index: 1,
        type: 'IMAGE',
        url: 'https://lp-public.s3.ap-northeast-2.amazonaws.com/not-login-stories/gallery/0-1.jpg',
        tag: {
          key: 'UNDER_TEENAGER',
          label: '10대 미만',
        },
      },
    ],
  },
  TEENAGER: {
    startYear: 1967,
    endYear: 1976,
    galleryCount: 2,
    gallery: [
      {
        id: 2,
        index: 2,
        type: 'IMAGE',
        url: 'https://lp-public.s3.ap-northeast-2.amazonaws.com/not-login-stories/gallery/10-1.jpg',
        story: {
          id: 1,
          title: '중학교 1학년 때 때 소풍 때 있었던 일',
          content:
            '1학년 때 갔던 소풍이 가장 기억에 남아.\n' +
            '친구들이랑 김밥도 같이 먹고 술래잡기도 하고 보물찾기도 했어.\n' +
            '\n' +
            '소풍 끝나고는 근처 유명한 콩국수 집 가서 콩국수를 먹었던 것 같은데 아직도 그 집이 있을지 모르겠네',
          date: '1970-04-06',
        },
        tag: {
          key: 'TEENAGER',
          label: '10대',
        },
      },
      {
        id: 3,
        index: 3,
        type: 'IMAGE',
        url: 'https://lp-public.s3.ap-northeast-2.amazonaws.com/not-login-stories/gallery/10-2.jpg',
        story: {
          id: 1,
          title: '공부하기 싫어했던 나',
          content: '공부보다는 친구들이랑 놀러 다니는게 너무 재미있더라고',
          date: '1971-05-20',
        },
        tag: {
          key: 'TEENAGER',
          label: '10대',
        },
      },
    ],
  },
  TWENTIES: {
    startYear: 1977,
    endYear: 1986,
    galleryCount: 1,
    gallery: [
      {
        id: 4,
        index: 4,
        type: 'VIDEO',
        url: 'https://lp-public.s3.ap-northeast-2.amazonaws.com/not-login-stories/gallery/20-1.mp4',
        story: {
          id: 2,
          title: '땅을 파보니 보석이 있었지',
          content:
            '결혼 전에는 아내가 나를 별로 안 좋아 했었어.\n' +
            '나랑 왜 결혼했는지 궁금했을 정도 였거든.\n' +
            '\n' +
            '그런데 결혼 후에는 나를 많이 사랑해주더라고.\n' +
            '그렇지 않아도 괜찮았는데 땅을 파보니 보석이 있었던 거지.',
          date: '1980-03-05',
        },
        tag: {
          key: 'TWENTIES',
          label: '20대',
        },
      },
    ],
  },
  THIRTY: {
    startYear: 1987,
    endYear: 1996,
    galleryCount: 2,
    gallery: [
      {
        id: 5,
        index: 5,
        type: 'IMAGE',
        url: 'https://lp-public.s3.ap-northeast-2.amazonaws.com/not-login-stories/gallery/30-1.jpg',
        story: {
          id: 3,
          title: '서른 넘어 늦게 엊은 딸과 딸바보의 손',
          content: '',
          date: '1991-08-06',
        },
        tag: {
          key: 'THIRTY',
          label: '30대',
        },
      },
      {
        id: 6,
        index: 6,
        type: 'IMAGE',
        url: 'https://lp-public.s3.ap-northeast-2.amazonaws.com/not-login-stories/gallery/30-2.jpg',
        story: {
          id: 3,
          title: '바닷가 가족 여행',
          content:
            '바닷가도 좋고 해산물을 좋아해서 강릉이나 부산, 목포 쪽으로 자주 가족 여행 갔었던게 기억에 많이 남네',
          date: '1995-07-20',
        },
        tag: {
          key: 'THIRTY',
          label: '30대',
        },
      },
    ],
  },
  FORTY: {
    startYear: 1997,
    endYear: 2006,
    galleryCount: 1,
    gallery: [
      {
        id: 7,
        index: 7,
        type: 'IMAGE',
        url: 'https://lp-public.s3.ap-northeast-2.amazonaws.com/not-login-stories/gallery/40-1.jpg',
        story: {
          id: 4,
          title: '회사에서 퇴직 후 시작한 택시 운전',
          content:
            '회사에서 좀 일찍 나오고 나서 막막해서 택시 운전을 시작했었지',
          date: '2006-03-05',
        },
        tag: {
          key: 'FORTY',
          label: '40대',
        },
      },
    ],
  },
  FIFTY: {
    startYear: 2007,
    endYear: 2016,
    galleryCount: 1,
    gallery: [
      {
        id: 8,
        index: 8,
        type: 'IMAGE',
        url: 'https://lp-public.s3.ap-northeast-2.amazonaws.com/not-login-stories/gallery/50-1.jpg',
        story: {
          id: 5,
          title: '첫 해외여행',
          content: '너희들이랑 해외도 나가보고 성공한 인생이지',
          date: '2014-12-21',
        },
        tag: {
          key: 'FIFTY',
          label: '50대',
        },
      },
    ],
  },
  SIXTY: {
    startYear: 2017,
    endYear: 2026,
    galleryCount: 1,
    gallery: [
      {
        id: 9,
        index: 9,
        type: 'IMAGE',
        url: 'https://lp-public.s3.ap-northeast-2.amazonaws.com/not-login-stories/gallery/60-1.jpg',
        story: {
          id: 6,
          title: '집 근처 산책',
          content: '요즘에는 아내랑 집 근처 산책하는게 제일 좋아',
          date: '2024-09-10',
        },
        tag: {
          key: 'SIXTY',
          label: '60대',
        },
      },
    ],
  },
};
export const DUMMY_TAGS: TagType[] = [
  {
    key: 'UNDER_TEENAGER',
    label: '10대 미만',
    count: 1,
  },
  {
    key: 'TEENAGER',
    label: '10대',
    count: 2,
  },
  {
    key: 'TWENTIES',
    label: '20대',
    count: 1,
  },
  {
    key: 'THIRTY',
    label: '30대',
    count: 1,
  },
  {
    key: 'FORTY',
    label: '40대',
    count: 1,
  },
  {
    key: 'FIFTY',
    label: '50대',
    count: 1,
  },
  {
    key: 'SIXTY',
    label: '60대',
    count: 1,
  },
];
