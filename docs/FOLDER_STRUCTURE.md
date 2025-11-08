# 폴더 구조 가이드라인

프로젝트의 폴더 구조를 체계적으로 관리하기 위한 가이드라인입니다.

## 페이지 그룹핑 기준

### 기본 원칙

**3-4개 이상의 관련 페이지가 있을 때 그룹핑을 적용합니다.**

- **3개 이상**: 그룹핑 고려 (경계선)
- **4개 이상**: 그룹핑 적극 권장
- **2개 이하**: 그룹핑하지 않고 평면적 구조 유지

### 그룹핑 이유

#### 그룹핑해야 하는 경우 (3-4개 이상)

```
pages/
├── Story/
│   ├── StoryWritingMain/
│   ├── StoryDetail/
│   ├── StoryList/
│   ├── StoryGallerySelector/
│   ├── GalleryDetail/
│   └── GalleryDetailFilter/
```

**장점:**

- 관련 페이지들의 논리적 그룹화
- pages 폴더의 항목 수 감소로 가독성 향상
- 도메인별 응집도 증가
- 유지보수 편의성

#### 그룹핑하지 않는 경우 (2개 이하)

```
pages/
├── LoginMain/
├── LoginOthers/
```

**이유:**

- 불필요한 중첩 단계 추가
- 폴더 구조가 오히려 복잡해짐
- import 경로가 길어짐: `pages/Login/LoginMain/` vs `pages/LoginMain/`

## 현재 적용된 구조

### 그룹핑된 페이지들

#### Story 관련 (6개 페이지)

```
app/pages/Story/
├── StoryWritingMain/
├── StoryDetail/
├── StoryList/
├── StoryGallerySelector/
├── GalleryDetail/
└── GalleryDetailFilter/
```

#### Hero 관련 (4개 페이지)

```
app/pages/Hero/
├── HeroModification/
├── HeroRegister/
├── HeroSelectingPhoto/
└── HeroSetting/
```

#### Account 관련 (3개 페이지)

```
app/pages/Account/
├── AccountModification/
├── AccountSelectingPhoto/
└── Register/
```

### 그룹핑하지 않은 페이지들

다음 페이지들은 관련 항목이 2개 이하이므로 평면적 구조를 유지합니다:

- Login 관련 (2개): `LoginMain/`, `LoginOthers/`
- AI Photo 관련 (2개): `AiPhoto/`, `AiPhotoMaker/`
- Policy 관련 (2개): `PrivacyPolicy/`, `ServicePolicy/`
- 단일 페이지들: `Home/`, `Onboarding/`, `FacebookGallerySelector/`

## 컴포넌트 구조 가이드라인

각 페이지 내부의 컴포넌트들도 유사한 원칙을 적용합니다:

### 컴포넌트 그룹핑 기준

페이지에서만 사용되는 컴포넌트가 3개 이상일 때 `components/` 폴더를 생성하고 논리적으로 그룹화합니다.

```
app/pages/Home/
├── HomePage.tsx
└── components/
    ├── BottomSheet/
    │   ├── SharedBottomSheet.tsx
    │   ├── MediaPickerBottomSheet.tsx
    │   └── BottomSheetSection.tsx
    ├── Gallery/
    │   ├── Gallery.tsx
    │   ├── GallerySelect.tsx
    │   └── GalleryTag.tsx
    └── Hero/
        ├── HeroOverview.tsx
        └── HeroSection.tsx
```

### 공통 컴포넌트

여러 페이지에서 사용되는 컴포넌트는 `app/components/` 에 위치합니다.

## 마이그레이션 가이드

### 새 페이지 추가 시

1. 관련 도메인의 기존 페이지 수 확인
2. 3개 이상이면 해당 그룹에 추가
3. 새로운 도메인이고 향후 확장 가능성이 있으면 그룹 생성 고려

### 기존 구조 변경 시

1. 모든 import 경로 업데이트 필요
2. 네비게이션 설정 확인
3. 테스트 파일 경로 확인

## 참고사항

- 이 가이드라인은 코드의 가독성과 유지보수성을 위한 것입니다
- 프로젝트 규모와 팀의 선호에 따라 조정 가능합니다
- 새로운 패턴이 발견되면 이 문서를 업데이트해야 합니다
