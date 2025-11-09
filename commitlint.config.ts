import type {UserConfig} from '@commitlint/types';

const Configuration: UserConfig = {
  rules: {
    // Chris Beams 스타일 설정 (type: prefix 없이)
    'subject-case': [2, 'always', 'sentence-case'], // 첫 글자 대문자
    'subject-max-length': [2, 'always', 50], // 50자 이내
    'subject-empty': [2, 'never'], // 제목 필수
    'subject-full-stop': [2, 'never', '.'], // 마침표 금지
    'type-empty': [0], // type 불필요
    'header-max-length': [0], // 헤더 길이 제한 비활성화 (멀티라인 대응)
  },
  parserPreset: {
    parserOpts: {
      // 첫 번째 라인만 파싱하도록 설정
      headerPattern: /^(.*)$/,
      headerCorrespondence: ['subject'],
    },
  },
};

export default Configuration;
