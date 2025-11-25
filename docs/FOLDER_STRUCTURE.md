# 폴더 구조 가이드라인

프로젝트의 폴더 구조를 체계적으로 관리하기 위한 가이드라인입니다.

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

- **6개**: StoryPages (스토리 작성, 상세, 목록, 갤러리 등)
- **4개**: HeroPages (수정, 등록, 사진선택, 설정)
- **3개**: AccountPages, GalleryPages
- **2개**: PolicyPages (개인정보, 서비스), AiPhotoPages
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

## 참고사항

- 이 가이드라인은 코드의 가독성과 유지보수성을 위한 것입니다
- 프로젝트 규모와 팀의 선호에 따라 조정 가능합니다
- 새로운 패턴이 발견되면 이 문서를 업데이트해야 합니다
