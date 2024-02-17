import {HeroType, LinkedUserType} from '../types/hero.type';
import {UserType} from '../types/user.type';

export const DUMMY_HERO: HeroType = {
  heroNo: -1,
  heroName: '주인공',
  heroNickName: '소중한분',
  birthday: new Date(1948, 1, 1),
  title: '햇살처럼 눈부셨던 지난 날의 이야기',
  imageURL: 'https://cdn-icons-png.flaticon.com/512/5798/5798277.png',
};

export const DUMMY_USER: UserType = {
  userNo: -1,
  userNickName: '게스트',
  userType: 'none',
  userId: '',
  recentHeroNo: -1,
  imageURL: require('../assets/images/profile_icon.png'),
};

export const DUMMY_LINKED_USER: LinkedUserType[] = [
  {
    userNo: -1,
    userNickName: '게스트1',
    userType: 'none',
    userId: '1',
    recentHeroNo: -1,
    imageURL: require('../assets/images/profile_icon.png'),
    role: 'ADMIN',
  },
  {
    userNo: 2,
    userNickName: '게스트2',
    userType: 'none',
    userId: '2',
    recentHeroNo: -1,
    imageURL: require('../assets/images/profile_icon.png'),
    role: 'WRITER',
  },
];
