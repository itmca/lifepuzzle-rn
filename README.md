# LifePuzzle - React Native

> 소중한 사람들과의 추억을 모으고 기록하는 모바일 애플리케이션

## 프로젝트 개요

LifePuzzle은 할아버지, 할머니와 같이 소중한 사람들의 사진들을 쉽게 모으고 이야기를 기록해가는 React Native 애플리케이션입니다.  
가족과의 소중한 순간들을 체계적으로 정리하고, AI 기술을 활용해 재미있는 사진도 만들며 추억을 더욱 특별하게 보존할 수 있습니다.

### 주요 기능

- **추억 수집**: 디바이스 갤러리, Facebook 등 다양한 소스에서 사진 모으기
- **이야기 기록**: 소중한 사람들과의 추억을 스토리로 기록하고 관리
- **인터랙티브 갤러리**: 사진 선택, 편집, 크롭 등 직관적인 사진 관리
- **AI 사진 생성**: 재미있고 특별한 추가 사진 생성 기능
- **소셜 로그인**: Kakao, Apple, Facebook 간편 로그인
- **멀티미디어**: 오디오 녹음/재생을 통한 풍부한 기록 경험

## 기술 스택

- **React Native** + **TypeScript** - 크로스 플랫폼 모바일 개발
- **Zustand** - 상태 관리
- **React Navigation** - 네비게이션
- 추억 기록, 이미지 처리, AI 사진 생성, 소셜 로그인 기능 지원

## 시작하기

### 개발 환경 요구사항

- Node.js 20+
- React Native CLI
- iOS: Xcode 15+, CocoaPods
- Android: Android Studio, JDK 17+

### 설치 및 실행

```bash
# 의존성 설치
npm install

# iOS 개발 환경
npm run ios:dev      # 개발 환경
npm run ios:prod     # 프로덕션 환경

# Android 개발 환경
npm run android:dev  # 개발 환경
npm run android:prod # 프로덕션 환경
```

### 개발 도구

```bash
npm run lint         # ESLint 검사
npm run test         # 테스트 실행
npm start           # Metro 번들러 시작
```

## 프로젝트 구조

```
app/
├── app.tsx                   # 앱 엔트리 포인트
├── assets/                   # 정적 자산 (이미지, 폰트, 아이콘)
├── components/              # 재사용 가능한 UI 컴포넌트들
├── constants/               # 전역 상수 (API URL, 색상 등)
├── navigation/              # 화면 간 이동을 위한 네비게이션 설정
│   ├── home-tab/           # 탭 네비게이션
│   └── no-tab/             # 스택 네비게이션
├── pages/                   # 각 화면을 담당하는 페이지 컴포넌트
│   ├── AccountPages/       # 계정 관련 페이지들
│   ├── GalleryPages/       # 갤러리 관련 페이지들
│   ├── HeroPages/          # 히어로(캐릭터) 관련 페이지들
│   └── StoryPages/         # 스토리 관련 페이지들
├── stores/                 # Zustand를 이용한 전역 상태 관리
├── service/                # 비즈니스 로직 및 API 호출 로직
│   └── hooks/              # 커스텀 훅
├── types/                  # TypeScript 타입 정의
└── utils/                  # 공통 유틸리티 함수
```

## 개발 가이드

- **[Code Style Guide](./docs/CODE_STYLE.md)** - React Native 코딩 스타일
- **[Naming Convention](./docs/NAMING.md)** - 파일, 변수, 함수 네이밍 규칙
- **[Git Workflow](./docs/GIT_WORKFLOW.md)** - Git 브랜치 전략 및 커밋 컨벤션
- **[Folder Structure](./docs/FOLDER_STRUCTURE.md)** - 폴더 구조 가이드라인

## 배포 및 버전 관리

- **버전 관리**: [Semantic Versioning](https://semver.org/) (Major.Minor.Patch)
- **Git 전략**: [Trunk Based Development](https://trunkbaseddevelopment.com/)
- **커밋 컨벤션**: [Chris Beams 스타일](https://chris.beams.io/posts/git-commit/)

### 브랜치 네이밍

```
<type>/<ticket-no>-<subject>
# 예시: feat/LP-1-user-authentication
```

### 커스텀 명령어 (Claude Code)

```bash
/create-pr                           # PR 템플릿 기반 자동 생성 (⚠️ 제목 50자 제한 확인 필요)
/new-feature 작업 설명                 # main 브랜치 동기화 후 작업 설명 기반 브랜치 생성하여 작업 진행
# 예시: /new-feature 사진 관련 컴포넌트 정리해줘
```

> **⚠️ create-pr 사용 시 주의사항**
> 자동 생성된 PR 제목이 50자를 초과할 경우 Chris Beams 규칙에 따라 수동으로 줄여야 합니다.
> 자세한 가이드라인은 [CLAUDE.md의 PR 제목 작성 규칙](CLAUDE.md#pr-제목-작성-규칙) 참조
