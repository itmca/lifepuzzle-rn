import {CodeType} from '../types/hero.type';

export const RoleList: CodeType[] = [
  {
    code: 'ADMIN',
    name: '관리자',
    description: '글 작성자 + 계정 초대 및 계정 권한 변경',
  },
  {
    code: 'WRITER',
    name: '글 작성자',
    description: '댓글 작성자 + 새로운 글 작성',
  },
  {
    code: 'VIEWER',
    name: '뷰어',
    description: '작성된 글 열람',
  },
  /* 
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
  */
];
