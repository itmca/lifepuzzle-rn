# lifepuzzle-rn

### Get Started

```bash
npm install # 패키지 설치
npm run android:prod # 안드로이드 실행
npm run ios:prod # iOS 실행
```

### Known Issues

#### Xcode objectVersion 자동 변경 이슈

Xcode에서 프로젝트를 열 때 `project.pbxproj` 파일의 `objectVersion`이 자동으로 54에서 70으로 변경되는 경우가 있습니다. 이는 최신 버전의 CocoaPods를 사용하더라도 빌드 실패를 일으킬 수 있습니다.

**해결 방법:**

1. Xcode에서 직접 실행하기
2. 또는 `ios/lifepuzzle.xcodeproj/project.pbxproj` 파일에서 `objectVersion`을 54로 수정 후 실행

### Structure of `app` Folder

```
app/
├── app.tsx                   # 앱 엔트리 포인트
├── assets/                   # 정적 자산 (이미지, 폰트, 아이콘)
│   ├── fonts/               # 폰트 파일
│   ├── icons/               # SVG 아이콘들
│   └── images/              # 이미지 파일
├── components/              # 재사용 가능한 UI 컴포넌트들
├── constants/               # 전역 상수 (API URL, 색상 등)
├── navigation/              # 화면 간 이동을 위한 네비게이션 설정
│   ├── home-tab/           # 탭 네비게이션
│   └── no-tab/             # 스택 네비게이션
├── pages/                   # 각 화면을 담당하는 페이지 컴포넌트
├── recoils/                # Recoil을 이용한 전역 상태 관리
├── service/                # 비즈니스 로직 및 API 호출 로직
│   └── hooks/              # 커스텀 훅
├── types/                  # TypeScript 타입 정의
└── utils/                  # 공통 유틸리티 함수
```

### Development Guide

- [Code Style Guide](./docs/CODE_STYLE.md)
- [Naming Guide](./docs/NAMING.md)

### Versioning

[Sementic Versioning](https://semver.org/)을 따릅니다. e.g. 1.2.3

Format: `Major.Minor.Patch`

- Major: 이전 버전과 호환되지 않는 변경 발생
- Minor: 새로운 기능 추가/수정/삭제
- Patch: 버그 해결 및 기타 수정

### Branch Name, Commit Msg Format

- Branch Name: `<type>/<ticket no>-<subject>`
  - 예시: feat/LP-1-foo
- Commit Msg: `<type>: <subject>`
  - 예시: feat: foo

type 설명

- feat: 새로운 기능 추가/수정/삭제
- fix: 버그 수정
- hotfix: 운영 환경 대상 긴급 버그 수정
- refactor: 리팩토링
- test: 테스트 코드 작성
- build: dependency 추가/수정/삭제
- docs: 문서 수정
- style: 코드 포맷, 스타일 수정
- chore: 위 타입들에 해당하지 않는 기타 작업

참고 사항

- 여러 성격을 가지는 커밋 또는 브랜치 명인 경우 대표하는 type 하나 사용
- 커밋의 경우 최대한 적절한 타입으로 나누어 커밋

### Git Strategy

기본적으로 [Trunk Based Development](https://trunkbaseddevelopment.com/)를 따릅니다.

Branches

- `main`: 기본 브랜치로 작업 브랜치들이 머지 되는 브랜치

Basic Flow

1. `main` 브랜치에서 작업 브랜치 생성 및 작업 진행
2. 작업 완료 후 `main` 브랜치로 PR, 리뷰 후 머지
3. 배포 시 `main` 브랜치에서 배포
4. 배포 후 버전 태그 추가 e.g. `v1.1.1`

Hotfix Flow

1. 배포 버전에서 버그 발생하여 긴급 수정 필요 시 버전 tag에서 `production`브랜치와 `hotfix` 브랜치 생성
   - e.g. `production/1.1.2`, `hotfix/fix-some-problem`
2. `hotfix` 브랜치 작업 후 `production` 브랜치로 PR 생성 (리뷰 권장되지만 생략 가능)
3. `production` 브랜치에서 배포 후 버전 tag 추가 (hotfix 시 patch 버전 업 e.g. 1.2.3 -> 1.2.4)
4. `production` 브랜치를 `main` 브랜치로 PR & 머지

### Ship Show Ask 전략

타입별 설명

- Ship: PR 생성 후 바로 머지하며 별도 리뷰가 필요하지 않습니다.
- Show:
  - PR 생성 후 바로 머지하지만 리뷰가 필요합니다.
  - 리뷰는 추후 별도 PR로 반영됩니다.
- ASK
  - PR 생성 후 리뷰 후 머지

### PR Template

- 형식: `[SHIP/SHOW/ASK][<ticket no>] <type>: <subject>`
- 예시: `[SHIP][LP-1] feat: 기능 개발`
