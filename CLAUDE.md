# CLAUDE.md

LifePuzzle React Native 프로젝트 작업 가이드

## 공통 가이드라인

다음 문서를 반드시 참조하세요:

- **[Git Workflow](./.team/base/GIT_WORKFLOW.md)** - 브랜치 전략, 커밋 컨벤션 (Chris Beams)
- **[PR Rules](./.team/base/PR_RULES.md)** - PR 제목/본문 작성 규칙

## 프로젝트 개요

**앱**: 소중한 사람들과의 추억을 모으고 기록하는 모바일 애플리케이션
**핵심 기술**: React Native + TypeScript, Recoil, React Navigation
**주요 기능**: 추억 수집 및 기록, 갤러리 관리, AI 사진 생성, 소셜 로그인

## 파일 구조

- **페이지 컴포넌트**: `app/pages/[Domain]/[PageName]/`
- **단일 페이지 전용 컴포넌트**: `app/pages/[Page]/components/`
- **공통 컴포넌트**: `app/components/` (2개 이상 페이지에서 사용)
- **서비스 계층**: `app/services/[domain]/` (도메인별 분리)
- **파일명**: TSX는 PascalCase, TS는 kebab-case.category.ts

**폴더 구조 변경 시 문서 업데이트 필수**: `docs/FOLDER_STRUCTURE.md`

## 개발 컨벤션

### 코딩 스타일

- Hook 순서: Refs → React hooks → Recoil → Navigation → Memoized → Custom hooks → Handlers → useEffect
- 변수: camelCase, 상수: UPPER_SNAKE_CASE
- 함수: 동사로 시작 (handle*, validate*, fetch\*)

### Navigation

**매직 스트링 사용 (권장)**

```typescript
// ✅ 권장: 매직 스트링 사용
navigation.navigate('App', {
  screen: 'StoryViewNavigator',
  params: { screen: 'Story' },
});
```

상수 사용 예외: Navigator 타입 정의, Deep linking 설정

### Services

**객체 네임스페이스 사용 (권장)**

```typescript
// ✅ 권장: 객체 네임스페이스
export const MyService = {
  method1(param: string): string {
    return param.toUpperCase();
  },
} as const;
```

클래스 사용 예외: 내부 상태를 가진 Storage 계층

## 보안 가이드라인

- **인증 토큰**: `SecureStorage` 사용 필수
- **로깅**: `console.log` 대신 `logger` 사용 필수
- **WebView**: 보안 속성 적용 필수

| 저장소          | 용도                  | 암호화 |
| --------------- | --------------------- | ------ |
| `SecureStorage` | 인증 토큰, 민감 정보  | O      |
| `LocalStorage`  | userNo, onboarding 등 | X      |

## Container 사용

```typescript
// 기본 페이지
<PageContainer isLoading={isLoading}>
  <ContentContainer withScreenPadding>
    {/* 내용 */}
  </ContentContainer>
</PageContainer>

// 스크롤 페이지
<PageContainer>
  <ScrollContainer>
    <ContentContainer withScreenPadding>...</ContentContainer>
  </ScrollContainer>
</PageContainer>
```

## 문서 참조

- [Code Style](./docs/CODE_STYLE.md)
- [Folder Structure](./docs/FOLDER_STRUCTURE.md)
- [Container](./docs/CONTAINER.md)
- [Navigation](./docs/NAVIGATION.md)
- [Services](./docs/SERVICES.md)
- [Zustand Patterns](./docs/ZUSTAND_PATTERNS.md)
- [Security](./docs/SECURITY.md)
