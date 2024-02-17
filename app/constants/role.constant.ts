import {CodeType} from '../types/hero.type';

export const RoleList: CodeType[] = [
  {
    code: 'WRITER',
    name: '작성자',
    description: '글을 작성하고 댓글을 달 수 있습니다.',
  },
  {
    code: 'COMMENTER',
    name: '보조작성자',
    description: '글을 작성할 순 없지만 댓글을 달 수 있습니다.',
  },
  {
    code: 'VIEWER',
    name: '뷰어',
    description: '작성된 글을 볼 수 있습니다.',
  },
  {
    code: 'ADMIN',
    name: '관리자',
    description: '글을 작성할 순 없지만 댓글을 달 수 있습니다.',
  },
  {
    code: 'OWNER',
    name: '소유자',
    description: '글을 작성하고 댓글을 달 수 있습니다.',
  },
];
