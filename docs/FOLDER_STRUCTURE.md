# 폴더 구조 가이드라인

프로젝트의 폴더 구조를 체계적으로 관리하기 위한 가이드라인입니다.

## 전체 프로젝트 구조 개요

```
lifepuzzle-rn/
├── app/
│   ├── components/        # 공통 컴포넌트
│   │   ├── ui/           # UI 컴포넌트 (base, layout, form, feedback, display, navigation, interaction)
│   │   └── feature/      # Feature 컴포넌트 (auth, ai, story, photo, voice, sharing, hero)
│   ├── pages/            # 페이지 컴포넌트
│   │   ├── AccountPages/ # 계정 관련 (5개)
│   │   ├── AiPhotoPages/ # AI 사진 (2개)
│   │   ├── GalleryPages/ # 갤러리 (4개)
│   │   ├── HeroPages/    # 히어로 (4개)
│   │   ├── PolicyPages/  # 정책 (2개)
│   │   ├── StoryPages/   # 스토리 (2개)
│   │   ├── Home/         # 홈 (단일)
│   │   └── Onboarding/   # 온보딩 (단일)
│   ├── services/         # 서비스 레이어
│   │   ├── auth/         # 인증 서비스
│   │   ├── common/       # 공통 서비스
│   │   ├── core/         # 핵심 인프라
│   │   ├── device/       # 디바이스
│   │   ├── gallery/      # 갤러리
│   │   ├── hero/         # 히어로
│   │   ├── image/        # 이미지 처리
│   │   ├── story/        # 스토리
│   │   └── user/         # 사용자
│   ├── navigation/       # 네비게이션 설정
│   ├── stores/           # 전역 상태 관리 (Zustand)
│   ├── hooks/            # 커스텀 Hooks
│   ├── utils/            # 유틸리티 함수
│   ├── types/            # TypeScript 타입 정의
│   ├── constants/        # 상수 정의
│   └── assets/           # 정적 자산 (이미지, 폰트 등)
├── docs/                 # 프로젝트 문서
│   ├── FOLDER_STRUCTURE.md
│   ├── CODE_STYLE.md
│   ├── NAMING.md
│   ├── NAVIGATION.md
│   ├── SERVICES.md
│   ├── GIT_WORKFLOW.md
│   └── SECURITY.md
└── CLAUDE.md            # 프로젝트 작업 가이드

```

> **중요**: 폴더 구조가 변경되면 이 문서를 반드시 업데이트해야 합니다.

## 페이지 그룹핑 기준

### 기본 원칙

- **3개 이상**: 무조건 그룹핑 적용
- **2개**: 도메인 관련성이 높을 때만 그룹핑 적용
- **1개**: 단일 페이지는 평면적 구조 유지

### 그룹핑 장점

#### 그룹핑 적용 사례

```
pages/
├── StoryPages/           # 6개 - 무조건 그룹핑
│   ├── StoryWritingMain/
│   ├── StoryDetail/
│   ├── StoryList/
│   └── ...
├── PolicyPages/          # 2개 - 관련성 높아서 그룹핑
│   ├── PrivacyPolicy/    # (개인정보처리방침)
│   └── ServicePolicy/    # (서비스이용약관)
├── AiPhotoPages/         # 2개 - 관련성 높아서 그룹핑
│   ├── AiPhoto/          # (AI 사진 보기)
│   └── AiPhotoMaker/     # (AI 사진 생성)
├── Home/                 # 1개 - 단일 페이지
└── Onboarding/           # 1개 - 단일 페이지
```

**장점:**

- 3개 이상: 가독성 향상 및 체계적 관리
- 2개(관련성 높음): 도메인 응집도 증가, 향후 확장 용이

#### 그룹핑하지 않는 경우

- 단일 페이지: `Home/`, `Onboarding/`
- 도메인 관련성이 낮은 페이지들

## 현재 적용된 구조

### 그룹핑된 페이지들

```
app/pages/
├── AccountPages/         # 계정 관련 (3개)
├── AiPhotoPages/        # AI 사진 관련 (2개)
├── GalleryPages/        # 갤러리 관련 (3개)
├── HeroPages/           # 히어로 관련 (4개)
├── PolicyPages/         # 정책 관련 (2개)
├── StoryPages/          # 스토리 관련 (6개)
├── Home/                # 단일 페이지
└── Onboarding/          # 단일 페이지
```

### 그룹핑 적용 현황

- **5개**: AccountPages (계정 설정, 프로필 선택, 로그인, 회원가입 등)
- **4개**: HeroPages (히어로 설정, 등록, 수정, 프로필 선택), GalleryPages (갤러리 목록, 선택, Facebook, 사진 편집)
- **2개**: StoryPages (스토리 작성, 상세), PolicyPages (개인정보, 서비스), AiPhotoPages (AI 사진 이력, 생성)
- **1개**: Home, Onboarding (단일 페이지 유지)

## 컴포넌트 구조 가이드라인

### 컴포넌트 배치 원칙

**1. 단일 페이지 전용 컴포넌트**

- 해당 페이지의 `components/` 폴더에 위치
- 3개 이상일 때 논리적으로 그룹화

```
app/pages/Home/
├── HomePage.tsx
└── components/
    ├── bottom-sheet/
    │   ├── SharedBottomSheet.tsx
    │   ├── MediaPickerBottomSheet.tsx
    │   └── BottomSheetSection.tsx
    ├── gallery/
    │   ├── Gallery.tsx
    │   ├── GallerySelect.tsx
    │   └── GalleryTag.tsx
    └── hero/
        ├── HeroOverview.tsx
        └── HeroSection.tsx
```

**2. 다중 페이지 공통 컴포넌트**

- `app/components/` 최상위에 `ui/`와 `feature/`로 분류
- UI 컴포넌트: 재사용 가능한 범용 인터페이스 요소
- Feature 컴포넌트: 특정 도메인 로직이 포함된 기능별 컴포넌트

```
app/components/
├── ui/
│   ├── base/           # 기본 스타일 컴포넌트
│   │   ├── ButtonBase.tsx
│   │   ├── TextBase.tsx
│   │   ├── ImageBase.tsx
│   │   ├── Divider.tsx
│   │   └── Dot.tsx
│   ├── layout/         # 레이아웃 컴포넌트
│   │   ├── ScreenContainer.tsx
│   │   ├── ContentContainer.tsx
│   │   └── SafeAreaContainer.tsx
│   ├── form/           # 폼 관련 컴포넌트
│   │   ├── Button.tsx
│   │   └── Dropdown.tsx
│   ├── feedback/       # 피드백 컴포넌트
│   │   ├── LoadingContainer.tsx
│   │   └── ApiErrorFallback.tsx
│   ├── display/        # 표시 컴포넌트
│   │   ├── Card.tsx
│   │   ├── Avatar.tsx
│   │   └── Tag.tsx
│   ├── navigation/     # 네비게이션 컴포넌트
│   │   ├── TopBar.tsx
│   │   └── header/
│   └── interaction/    # 상호작용 컴포넌트
│       ├── BottomSheet.tsx
│       └── ActionSheet.tsx
└── feature/
    ├── auth/           # 인증 관련
    │   ├── RegisterButton.tsx
    │   └── OtherLoginButton.tsx
    ├── ai/             # AI 기능
    │   └── AiPhotoButton.tsx
    ├── story/          # 스토리 기능
    │   ├── StoryWritingButton.tsx
    │   └── story/
    ├── photo/          # 사진 관리
    ├── voice/          # 음성 기능
    │   ├── VoiceAddButton.tsx
    │   └── VoicePlayButton.tsx
    ├── sharing/        # 공유 기능
    │   └── ShareButton.tsx
    └── hero/           # 히어로 관련
```

### 컴포넌트 분류 기준

**UI 컴포넌트 (`app/components/ui/`)**

- 순수한 UI 요소로 비즈니스 로직 없음
- 재사용성이 높고 여러 도메인에서 활용 가능
- Props를 통해 동작이 결정됨

**Feature 컴포넌트 (`app/components/feature/`)**

- 특정 도메인의 비즈니스 로직 포함
- 해당 기능 영역에 특화된 컴포넌트
- 도메인별로 하위 디렉토리 구성

### 컴포넌트 이동 기준

**페이지 → 공통으로 이동 시점:**

- 2개 이상 페이지에서 동일한 컴포넌트 사용
- 유사한 기능의 컴포넌트가 여러 페이지에 중복 구현

**공통 → 페이지로 이동 시점:**

- 특정 페이지에서만 사용되도록 요구사항 변경
- 해당 페이지에 특화된 로직이 많이 추가된 경우

## 마이그레이션 가이드

### 새 페이지 추가 시

1. 관련 도메인의 기존 페이지 수 확인
2. **3개 이상**: 해당 그룹에 추가
3. **2개**: 도메인 관련성이 높으면 그룹 생성, 낮으면 평면적 구조 유지
4. **1개**: 새로운 도메인이면 일단 평면적 구조로 시작

### 기존 구조 변경 시

1. 모든 import 경로 업데이트 필요
2. 네비게이션 설정 확인
3. 테스트 파일 경로 확인

## Services 폴더 구조

### 기본 원칙

- 도메인별로 폴더 분리
- 각 도메인은 관련된 서비스 파일들을 포함
- 파일명: `{domain}-{category}.service.ts` 또는 `{domain}.{category}.ts`

### 현재 구조

```
app/services/
├── auth/              # 인증 관련
│   ├── login.hook.ts
│   ├── logout.hook.ts
│   ├── refresh.hook.ts
│   └── validation.hook.ts
├── common/            # 공통 서비스
│   ├── error-handler.hook.ts
│   ├── form-validation.service.ts
│   ├── update.hook.ts
│   └── voice-record.hook.ts
├── core/              # 핵심 인프라
│   ├── auth.service.ts
│   ├── auth-http.hook.ts
│   ├── http.hook.ts
│   ├── http.service.ts
│   ├── local-storage.hook.ts
│   ├── local-storage.service.ts
│   └── secure-storage.service.ts
├── device/            # 디바이스 관련
│   ├── keyboard.hook.ts
│   ├── linking.hook.ts
│   ├── permission.hook.ts
│   └── screen.hook.ts
├── gallery/           # 갤러리 관련
│   ├── ai-photo.create.hook.ts
│   ├── ai-photo.query.hook.ts
│   ├── facebook.photos.hook.ts
│   ├── gallery.api.service.ts
│   ├── gallery.query.hook.ts
│   ├── gallery.upload.hook.ts
│   └── gallery-upload-*.ts
├── hero/              # 히어로 관련
│   ├── hero.create.hook.ts
│   ├── hero.delete.hook.ts
│   ├── hero.query.hook.ts
│   ├── hero.update.hook.ts
│   ├── hero-payload.service.ts
│   └── share.hero.hook.ts
├── image/             # 이미지 처리
│   ├── platform-image.service.ts
│   └── skia-image-loader.service.ts
├── story/             # 스토리 관련
│   ├── story.delete.hook.ts
│   ├── story.write.hook.ts
│   ├── story-form.factory.ts
│   ├── story-navigation.service.ts
│   ├── story-payload.service.ts
│   └── story-validation.hook.ts
└── user/              # 사용자 관련
    ├── user.update.hook.ts
    ├── user.withdraw.hook.ts
    └── user-payload.service.ts
```

### 파일 네이밍 규칙

**Hook 파일** (`*.hook.ts`)

- React Hooks를 사용하는 파일
- 예: `login.hook.ts`, `gallery.query.hook.ts`

**Service 파일** (`*.service.ts`)

- 순수 함수 모음 (객체 네임스페이스 또는 클래스)
- 예: `http.service.ts`, `form-validation.service.ts`

**Factory 파일** (`*.factory.ts`)

- 객체 생성 로직
- 예: `story-form.factory.ts`

**Util 파일** (`*.util.ts`)

- 유틸리티 함수 모음
- 예: `gallery-upload-helpers.util.ts`

## 참고사항

- 이 가이드라인은 코드의 가독성과 유지보수성을 위한 것입니다
- 프로젝트 규모와 팀의 선호에 따라 조정 가능합니다
- **새로운 패턴이 발견되거나 폴더 구조가 변경되면 이 문서를 반드시 업데이트해야 합니다**
