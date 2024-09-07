const HeroAuthTypes = [
  {
    code: 'OWNER',
    name: '소유자',
    description: '글 작성자 + 계정 초대 및 계정 권한 변경',
    priority: 0,
  },
  {
    code: 'ADMIN',
    name: '관리자',
    description: '글 작성자 + 계정 초대 및 계정 권한 변경',
    priority: 1,
  },
  {
    code: 'WRITER',
    name: '글 작성자',
    description: '댓글 작성자 + 새로운 글 작성',
    priority: 2,
  },
  // 2024.09에는 댓글 기능이 없어 COMMENTER는 사용되지 않음
  // {
  //   code: 'COMMENTER',
  //   name: '보조작성자',
  //   description: '글을 작성할 순 없지만 댓글을 달 수 있습니다.',
  // },
  {
    code: 'VIEWER',
    name: '뷰어',
    description: '작성된 글 열람',
    priority: 3,
  },
] as const;

export const SortedHeroAuthTypes = [...HeroAuthTypes].sort(
  (a, b) => a.priority - b.priority,
);

export type HeroAuthTypeCode = (typeof HeroAuthTypes)[number]['code'];

export const HeroAuthTypeByCode = HeroAuthTypes.reduce((acc, cur) => {
  return {...acc, [cur.code]: cur};
}, {} as Record<HeroAuthTypeCode, (typeof HeroAuthTypes)[number]>);
