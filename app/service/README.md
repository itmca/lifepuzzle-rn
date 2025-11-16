# LifePuzzle Service Layer Architecture

## 🏗️ 새로운 아키텍처 개요

이 프로젝트의 Service Layer는 함수형 접근 방식과 Hook 기반 패턴을 사용하여 완전히 재구성되었습니다.

## 📁 새로운 디렉토리 구조

```
app/service/
├── api/                          # API 클라이언트 서비스
│   ├── base-api.service.ts       # 기본 HTTP 클라이언트
│   ├── authenticated-api.service.ts # 인증된 API 클라이언트
│   └── gallery.api.service.ts    # (기존) 갤러리 API 서비스
├── error/                        # 중앙집중식 에러 처리
│   └── error-handler.service.ts
├── hooks/                        # React Hooks
│   ├── core/                     # 핵심 Hook 팩토리
│   │   ├── api-hook.factory.ts   # Generic API Hook 팩토리
│   │   └── use-api.ts           # API 클라이언트 Hook
│   ├── domain/                   # 도메인별 비즈니스 로직
│   │   ├── auth/                # 인증 관련
│   │   └── hero/                # Hero 도메인
│   ├── ui/                      # UI 관련 Hook
│   │   ├── use-keyboard.ts      # 키보드 상태 관리
│   │   └── use-screen.ts        # 화면 크기/방향 관리
│   ├── utils/                   # 유틸리티 Hook
│   │   ├── use-validation.ts    # 유효성 검사
│   │   └── use-update-publisher.ts # 이벤트 발행/구독
│   ├── legacy/                  # 기존 Hook (점진적 제거 예정)
│   └── index.ts                 # 통합 Export
├── *.service.ts                 # 기존 유틸리티 서비스들
└── README.md                    # 이 파일
```

## 🚀 주요 개선사항

### 1. 함수형 API 클라이언트

- **이전**: Class 기반 서비스
- **이후**: 순수 함수와 팩토리 패턴 사용

```typescript
// ✅ 새로운 방식
import {useApi} from '@/service/hooks';

const MyComponent = () => {
  const api = useApi(); // 자동 인증 처리

  const fetchData = async () => {
    const result = await api.get<DataType>('/endpoint');
    return result;
  };
};
```

### 2. Generic Hook 팩토리

```typescript
// ✅ 표준화된 CRUD Hook
const useHeroCrud = () => {
  const api = useApi();
  return createCrudHook<HeroType>(api, {
    endpoint: '/v1/heroes',
    entityName: '주인공',
  });
};
```

### 3. 중앙집중식 에러 처리

```typescript
// ✅ 표준화된 에러 처리
import {createErrorHandler} from '@/service/error/error-handler.service';

const errorHandler = createErrorHandler('주인공');
errorHandler.handleCreateError(error, retryFn);
```

### 4. 타입 안전성 강화

- 모든 API 응답에 Generic 타입 적용
- 표준화된 에러 타입 정의
- Hook 반환 타입 명시

## 📋 마이그레이션 가이드

### 기존 Hook을 새로운 패턴으로 변경하기

#### 1. 기본 API Hook 마이그레이션

**이전 (기존)**:

```typescript
const [loading, fetchData] = useAuthAxios<ResponseType>({
  requestOption: {url: '/api/endpoint', method: 'get'},
  onResponseSuccess: data => setData(data),
  onError: error => console.error(error),
});
```

**이후 (새로운)**:

```typescript
const api = useApi();
const dataHook = createApiHook<ResponseType>(api, {
  url: '/api/endpoint',
  method: 'GET',
  onSuccess: data => setData(data),
  onError: error => console.error(error),
});

const {data, loading, error, execute} = dataHook();
```

#### 2. CRUD Operations 마이그레이션

**이전**:

```typescript
// 여러 개의 개별 Hook들
const [createLoading, createHero] = useCreateHero();
const [updateLoading, updateHero] = useUpdateHero();
const [deleteLoading, deleteHero] = useDeleteHero();
```

**이후**:

```typescript
// 하나의 통합 Hook
const {
  createItem: createHero,
  updateItem: updateHero,
  deleteItem: deleteHero,
  loading,
} = useHeroCrud();
```

#### 3. 에러 처리 마이그레이션

**이전**:

```typescript
const {handleCreateError} = useErrorHandler();
```

**이후**:

```typescript
const errorHandler = createErrorHandler('주인공');
errorHandler.handleCreateError(error, retryFn);
```

## 🎯 사용 예제

### 1. 기본 데이터 조회

```typescript
import { useHero } from '@/service/hooks';

const HeroDetail = ({ heroId }: { heroId: number }) => {
  const { hero, loading, error, refetch } = useHero(heroId);

  if (loading) return <Loading />;
  if (error) return <ErrorView error={error} onRetry={refetch} />;

  return <HeroView hero={hero} />;
};
```

### 2. 데이터 생성/수정

```typescript
import { useCreateHero } from '@/service/hooks';

const CreateHeroPage = () => {
  const [handleSubmit, loading] = useCreateHero();

  return (
    <form>
      <Button onPress={handleSubmit} loading={loading}>
        생성하기
      </Button>
    </form>
  );
};
```

### 3. 커스텀 API Hook 생성

```typescript
import {useApi, createApiHook} from '@/service/hooks';

const useCustomData = (id: string) => {
  const api = useApi();

  return createApiHook<CustomDataType>(api, {
    url: `/custom/endpoint/${id}`,
    method: 'GET',
    entityName: '커스텀 데이터',
  })();
};
```

## 🔧 점진적 마이그레이션 전략

1. **Phase 1**: 새로운 Hook들과 기존 Hook들을 병행 사용
2. **Phase 2**: 컴포넌트별로 점진적으로 새로운 패턴 적용
3. **Phase 3**: 기존 Hook들 제거 (`app/service/hooks/legacy/` 폴더)

## 📝 개발 가이드라인

### DO's ✅

- `useApi()` Hook을 통해 API 클라이언트 사용
- `createApiHook()` 팩토리로 표준화된 Hook 생성
- 도메인별로 Hook 그룹핑
- 중앙집중식 에러 처리 사용
- Generic 타입 적극 활용

### DON'Ts ❌

- Class 기반 서비스 생성 금지
- 직접적인 axios 사용 금지
- 컴포넌트 내부에서 복잡한 API 로직 구현 금지
- 개별적인 에러 처리 로직 중복 구현 금지

## 🧪 테스트 가이드

새로운 구조는 테스트 용이성을 고려하여 설계되었습니다:

```typescript
// Mock API 서비스
const mockApi = {
  get: jest.fn(),
  post: jest.fn(),
  // ...
};

// Hook 테스트
const {result} = renderHook(() =>
  createApiHook(mockApi, {url: '/test', entityName: 'test'})(),
);
```

---

더 자세한 내용은 각 디렉토리의 파일들을 참고해주세요.
