import {getStoryDisplayTagsDate} from './story-display.service';

test('스토리 노출 태그, 날짜에는 모든 태그의 displayName과 YYYY-MM-DD 형태의 날짜가 포함된다.', () => {
  const storyDisplayTagsDate = getStoryDisplayTagsDate({
    audios: [],
    content: '',
    createdAt: new Date('2022-01-01'),
    date: new Date('2022-11-25'),
    heroNo: 0,
    id: '',
    photos: [],
    tags: [
      {
        key: 'tag1',
        displayName: '태그1',
        priority: 1,
      },
      {
        key: 'tag2',
        displayName: '태그2',
        priority: 2,
      },
    ],
    title: '',
  });

  expect(storyDisplayTagsDate).toContain('태그1');
  expect(storyDisplayTagsDate).toContain('태그2');
  expect(storyDisplayTagsDate).toContain('2022년 11월 25일');
});
