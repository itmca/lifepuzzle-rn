# Zustand 사용 패턴 가이드

LifePuzzle React Native 프로젝트의 Zustand 상태 관리 권장 패턴입니다.

## 목차

1. [기본 원칙](#기본-원칙)
2. [구독 패턴](#구독-패턴)
3. [Store 설계](#store-설계)
4. [안티패턴](#안티패턴)
5. [성능 최적화](#성능-최적화)

---

## 기본 원칙

### 1. Subscribe with Selectors

**필요한 값만 정확히 선택하여 구독합니다.**

```typescript
// ✅ 권장: Selector로 필요한 값만 선택
const currentHero = useHeroStore(state => state.currentHero);
const setHero = useHeroStore(state => state.setCurrentHero);

// ❌ 비권장: 전체 store 구조분해 (불필요한 리렌더 발생)
const { currentHero, writingHero, setCurrentHero } = useHeroStore();
```

**이유**: 전체 store를 구조분해하면 store의 어떤 값이 변경되어도 컴포넌트가 리렌더됩니다.

---

### 2. Use Shallow Comparison

**여러 값을 동시에 선택할 때는 `useShallow`를 사용합니다.**

```typescript
import { useShallow } from 'zustand/react/shallow';

// ✅ 권장: 여러 값을 선택할 때 shallow 사용
const { selectedTag, setSelectedTag } = useSelectionStore(
  useShallow(state => ({
    selectedTag: state.selectedTag,
    setSelectedTag: state.setSelectedTag,
  })),
);

// ❌ 비권장: 개별 selector 남발
const selectedTag = useSelectionStore(state => state.selectedTag);
const setSelectedTag = useSelectionStore(state => state.setSelectedTag);
```

**사용 시기**:

- 2-3개 이상의 관련된 값을 함께 사용할 때
- Action 함수들을 묶어서 가져올 때

---

### 3. Split Stores into Slices

**관련 없는 상태는 별도 store로 분리합니다.**

```typescript
// ✅ 권장: 도메인별 분리
export const useAuthStore = create<AuthState>(...);
export const useUserStore = create<UserState>(...);
export const useUIStore = create<UiState>(...);

// ❌ 비권장: 하나의 거대한 store
export const useAppStore = create<{
  auth: AuthState;
  user: UserState;
  ui: UiState;
}>(...);
```

**현재 Store 구조**:

- `useAuthStore`: 인증 토큰
- `useUserStore`: 사용자 프로필
- `useHeroStore`: Hero 데이터
- `useStoryStore`: 스토리 작성/재생
- `useMediaStore`: 갤러리/태그
- `useSelectionStore`: UI 선택 상태
- `useUIStore`: 업로드/모달 상태
- `useShareStore`: 공유 데이터
- `useCacheStore`: 캐시 무효화

---

### 4. Local State First

**전역 공유가 불필요한 상태는 로컬 상태로 관리합니다.**

```typescript
// ✅ 권장: 컴포넌트 내부 상태
const [isModalOpen, setIsModalOpen] = useState(false);

// ❌ 비권장: 불필요한 전역 상태
const isModalOpen = useUIStore(state => state.isModalOpen);
```

**Zustand 사용 기준**:

- ✅ 여러 페이지/컴포넌트에서 공유 필요
- ✅ Navigation 간 상태 유지 필요
- ✅ Deep linking으로 복원 필요
- ❌ 단일 컴포넌트 내부 UI 상태
- ❌ 일회성 임시 데이터

---

## 구독 패턴

### Pattern 1: Single Value Selector

**단일 값만 필요할 때**

```typescript
const hero = useHeroStore(state => state.currentHero);
const gallery = useMediaStore(state => state.gallery);
const isLoggedIn = useAuthStore(state => state.isLoggedIn());
```

---

### Pattern 2: Multiple Values with Shallow

**여러 관련 값이 필요할 때**

```typescript
import { useShallow } from 'zustand/react/shallow';

const { selectedTag, setCurrentGalleryIndex, setSelectedTag } =
  useSelectionStore(
    useShallow(state => ({
      selectedTag: state.selectedTag,
      setCurrentGalleryIndex: state.setCurrentGalleryIndex,
      setSelectedTag: state.setSelectedTag,
    })),
  );
```

---

### Pattern 3: Actions Only

**상태는 필요 없고 action만 필요할 때**

```typescript
// ✅ 권장: Action만 선택
const setGalleryError = useMediaStore(state => state.setGalleryError);
const resetWritingStory = useStoryStore(state => state.resetWritingStory);

// ⚠️ 주의: Action은 참조가 안정적이므로 리렌더 걱정 없음
```

---

### Pattern 4: Direct Access (Outside React)

**React 컴포넌트 외부에서 접근할 때**

```typescript
// Service 레이어, 이벤트 핸들러 등
const updateGalleryStory = useMediaStore.getState().updateGalleryStory;
const authTokens = useAuthStore.getState().authTokens;

// Navigation listener에서
const selectedStoryKey = useStoryStore.getState().selectedStoryKey;
```

---

## Store 설계

### Store 구조 원칙

```typescript
interface ExampleState {
  // 1. 상태 필드 (primitive 우선)
  value: string;
  count: number;
  isLoading: boolean;

  // 2. 복잡한 객체/배열
  items: ItemType[];
  config: ConfigType;

  // 3. Actions (set prefix)
  setValue: (value: string) => void;
  setCount: (count: number) => void;

  // 4. Reset actions
  resetValue: () => void;
  resetAll: () => void;
}

export const useExampleStore = create<ExampleState>((set, get) => ({
  // Default values
  value: '',
  count: 0,
  isLoading: false,
  items: [],
  config: {},

  // Actions
  setValue: value => set({ value }),
  setCount: count => set({ count }),

  // Partial update for objects
  updateConfig: (newConfig: Partial<ConfigType>) =>
    set(state => ({
      config: { ...state.config, ...newConfig },
    })),

  // Reset
  resetValue: () => set({ value: '' }),
  resetAll: () =>
    set({
      value: '',
      count: 0,
      isLoading: false,
      items: [],
      config: {},
    }),
}));
```

---

### 개별 필드 vs 객체 그룹핑

**❌ 비권장: 객체로 그룹핑 (리렌더 문제)**

```typescript
interface BadUIState {
  uploadState: {
    story: boolean;
    hero: boolean;
    gallery: boolean;
  };
  setUploadState: (state: Partial<UploadState>) => void;
}

// 문제: story 업로드 변경 시 gallery 구독자도 리렌더!
const isGalleryUploading = useUIStore(state => state.uploadState.gallery);
```

**✅ 권장: 개별 필드로 분리**

```typescript
interface GoodUIState {
  isStoryUploading: boolean;
  isHeroUploading: boolean;
  isGalleryUploading: boolean;

  setStoryUploading: (value: boolean) => void;
  setHeroUploading: (value: boolean) => void;
  setGalleryUploading: (value: boolean) => void;
}

// 독립적인 구독: story 변경이 gallery에 영향 없음
const isGalleryUploading = useUIStore(state => state.isGalleryUploading);
```

**예외: 객체가 항상 함께 사용될 때**

```typescript
// ✅ 허용: 항상 함께 사용되는 경우
interface UserState {
  user: UserType | null; // id, name, email 등 항상 함께 사용
  setUser: (user: UserType) => void;
}
```

---

## 안티패턴

### ❌ Anti-Pattern 1: Over-subscription

**문제**: 전체 store 구조분해로 불필요한 리렌더

```typescript
// ❌ 나쁜 예
const {
  currentGalleryIndex,
  selectedTag,
  selectedGalleryItems,
  editGalleryItems,
  selectedHeroPhoto,
  setCurrentGalleryIndex,
} = useSelectionStore();

// 실제로는 currentGalleryIndex만 사용
// 하지만 selectedTag 변경 시에도 리렌더!
```

**해결책**:

```typescript
// ✅ 좋은 예
const currentGalleryIndex = useSelectionStore(
  state => state.currentGalleryIndex,
);
const setCurrentGalleryIndex = useSelectionStore(
  state => state.setCurrentGalleryIndex,
);
```

---

### ❌ Anti-Pattern 2: Props Drilling with Store State

**문제**: 부모가 store 값을 props로 전달하면 부모 리렌더 시 자식도 리렌더

```typescript
// ❌ 나쁜 예: HomePage
const ageGroups = useMediaStore(state => state.ageGroups);
const tags = useMediaStore(state => state.tags);

return <Gallery ageGroups={ageGroups} tags={tags} />;

// Gallery는 HomePage 리렌더 시 항상 리렌더됨
```

**해결책**:

```typescript
// ✅ 좋은 예: Gallery 내부에서 직접 구독
export const Gallery = React.memo(() => {
  const ageGroups = useMediaStore(state => state.ageGroups);
  const tags = useMediaStore(state => state.tags);

  // HomePage 리렌더와 무관하게 독립적으로 동작
});
```

---

### ❌ Anti-Pattern 3: Computed Values in Store

**문제**: 파생 상태를 store에 저장하면 참조 변경으로 리렌더

```typescript
// ❌ 나쁜 예
const computeGallery = (ageGroups, tags) => {
  return Object.entries(ageGroups).map(...).flat(); // 항상 새 배열
};

setAgeGroups: ageGroups => {
  const gallery = computeGallery(ageGroups, tags); // 새 배열 생성
  set({ ageGroups, gallery }); // gallery 구독자 모두 리렌더
}
```

**해결책**:

```typescript
// ✅ 좋은 예: Custom hook으로 필요할 때만 계산
export const useGallery = () => {
  return useMediaStore(state => computeGallery(state.ageGroups, state.tags));
};

// 또는 useMemo 사용
const gallery = useMemo(
  () => computeGallery(ageGroups, tags),
  [ageGroups, tags],
);
```

---

### ❌ Anti-Pattern 4: Multiple Individual Selectors

**문제**: 관련된 값들을 개별 selector로 가져오면 코드 중복

```typescript
// ❌ 비효율적
const selectedTag = useSelectionStore(state => state.selectedTag);
const setCurrentGalleryIndex = useSelectionStore(
  state => state.setCurrentGalleryIndex,
);
const setSelectedTag = useSelectionStore(state => state.setSelectedTag);
```

**해결책**:

```typescript
// ✅ useShallow로 묶기
import { useShallow } from 'zustand/react/shallow';

const { selectedTag, setCurrentGalleryIndex, setSelectedTag } =
  useSelectionStore(
    useShallow(state => ({
      selectedTag: state.selectedTag,
      setCurrentGalleryIndex: state.setCurrentGalleryIndex,
      setSelectedTag: state.setSelectedTag,
    })),
  );
```

---

## 성능 최적화

### 1. React.memo 활용

컴포넌트가 store를 직접 구독하면 props 변경과 무관하게 동작합니다.

```typescript
export const Gallery = React.memo(() => {
  const ageGroups = useMediaStore(state => state.ageGroups);
  const tags = useMediaStore(state => state.tags);

  // ageGroups, tags 변경 시에만 리렌더
  // 부모 컴포넌트 리렌더와 무관
});
```

---

### 2. 렌더링 디버깅

**useRenderLog 활용**:

```typescript
import { useRenderLog } from '../utils/debug/render-log.util';

const HomePage = () => {
  useRenderLog('HomePage', {
    hero,
    galleryCount: gallery?.length,
    selectedTag: selectedTag?.key,
  });

  // 렌더링 원인을 콘솔에서 확인 가능
};
```

**출력 예시**:

```
[RENDER] HomePage | hero: {...}, galleryCount: 45, selectedTag: "FAMILY"
```

---

### 3. 의존성 최소화

useCallback, useMemo의 의존성 배열을 최소화합니다.

```typescript
// ✅ 권장: 필요한 것만 의존성에 추가
const handlePress = useCallback(() => {
  const currentGallery = useMediaStore.getState().gallery;
  // gallery를 의존성에 넣지 않고 getState()로 최신 값 사용
}, []);

// ❌ 비권장: 불필요한 의존성
const handlePress = useCallback(() => {
  console.log(gallery);
}, [gallery]); // gallery 변경마다 함수 재생성
```

---

### 4. 선택적 구독

조건부로 필요한 경우에만 구독합니다.

```typescript
// ✅ 조건부 렌더링 + 조건부 구독
const MyComponent = ({ showDetails }: Props) => {
  // showDetails가 true일 때만 구독
  const details = showDetails
    ? useMediaStore(state => state.details)
    : null;

  if (!showDetails) return <SimplifiedView />;
  return <DetailedView details={details} />;
};
```

---

## 체크리스트

새로운 Zustand 사용 시 확인하세요:

- [ ] **Selector 특정성**: 필요한 값만 정확히 선택했는가?
- [ ] **Shallow 비교**: 여러 값을 선택할 때 `useShallow`를 사용했는가?
- [ ] **로컬 우선**: 전역 상태가 정말 필요한가? 로컬 상태로 충분하지 않은가?
- [ ] **Props vs 내부 구독**: 컴포넌트가 store 값을 props로 받아야 하는가, 내부에서 구독해야 하는가?
- [ ] **객체 그룹핑**: 여러 boolean을 객체로 묶지 않았는가?
- [ ] **파생 상태**: 계산된 값을 store에 저장하지 않았는가?
- [ ] **React.memo**: 컴포넌트가 불필요하게 리렌더되지 않도록 메모이제이션했는가?

---

## 참고

- [Zustand 공식 문서](https://docs.pmnd.rs/zustand/getting-started/introduction)
- [프로젝트 Store 목록](../app/stores/)
- [CLAUDE.md - Services 가이드](./SERVICES.md)
