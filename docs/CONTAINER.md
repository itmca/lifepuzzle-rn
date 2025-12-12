# Container 사용 가이드

LifePuzzle React Native 프로젝트에서 사용하는 Container 컴포넌트들의 계층 구조와 사용법을 설명합니다.

## 목차

- [Container 계층 구조](#container-계층-구조)
- [Container 종류](#container-종류)
- [사용 패턴](#사용-패턴)
- [마이그레이션 가이드](#마이그레이션-가이드)

## Container 계층 구조

Container는 명확한 계층 구조를 가지며, 각 계층은 특정한 역할을 담당합니다.

```
PageContainer (최상위)
└── ScrollContainer (스크롤 필요시)
    └── ContentContainer (레이아웃)
        └── ContentContainer (중첩 레이아웃)
```

### 계층별 역할

| 계층 | 컴포넌트           | 역할                      | 사용 위치     |
| ---- | ------------------ | ------------------------- | ------------- |
| 1    | `PageContainer`    | SafeArea, 로딩, 에러 처리 | 페이지 최상위 |
| 2    | `ScrollContainer`  | 스크롤, 키보드 처리       | 스크롤 필요시 |
| 3    | `ContentContainer` | 레이아웃, 스타일링        | 내부 레이아웃 |

## Container 종류

### 1. PageContainer (필수)

모든 페이지의 최상위에 사용하는 컨테이너입니다.

**역할:**

- SafeArea 처리
- 로딩 상태 관리
- 에러 처리 및 재시도

**주요 Props:**

```typescript
type PageContainerProps = {
  children: ReactNode;
  isLoading?: boolean; // 로딩 상태
  isError?: boolean; // 에러 상태
  onRetry?: () => void; // 재시도 핸들러
  edges?: ReadonlyArray<Edge>; // SafeArea edges (기본: ['left', 'right', 'bottom'])
};
```

**사용 예시:**

```tsx
// 기본 사용
<PageContainer isLoading={isLoading}>
  <ContentContainer withScreenPadding>
    {/* 페이지 내용 */}
  </ContentContainer>
</PageContainer>

// 에러 처리 포함
<PageContainer
  isLoading={isLoading}
  isError={isError}
  onRetry={refetch}
>
  {/* 페이지 내용 */}
</PageContainer>
```

### 2. ScrollContainer (선택)

스크롤이 필요한 페이지에서 사용하는 컨테이너입니다.

**역할:**

- 스크롤 처리
- 키보드 회피 (키보드가 입력 필드를 가리지 않도록)
- Pull to Refresh

**주요 Props:**

```typescript
type ScrollContainerProps = {
  children: ReactNode;
  keyboardAware?: boolean; // 키보드 처리 여부 (기본: false)
  horizontal?: boolean; // 가로 스크롤 (기본: false)
  onRefresh?: () => void; // Pull to Refresh 핸들러
  refreshing?: boolean; // 새로고침 중 상태
  bottomOffset?: number; // 키보드 하단 여백 (기본: 20)
};
```

**사용 예시:**

```tsx
// 일반 스크롤
<PageContainer isLoading={isLoading}>
  <ScrollContainer>
    <ContentContainer withScreenPadding>
      {/* 스크롤 내용 */}
    </ContentContainer>
  </ScrollContainer>
</PageContainer>

// 키보드 처리가 필요한 폼
<PageContainer isLoading={isLoading}>
  <ScrollContainer keyboardAware>
    <ContentContainer withScreenPadding>
      <TextInput />
      <TextInput />
    </ContentContainer>
  </ScrollContainer>
</PageContainer>

// Pull to Refresh
<PageContainer isLoading={isLoading}>
  <ScrollContainer
    onRefresh={refetch}
    refreshing={isRefreshing}
  >
    {/* 내용 */}
  </ScrollContainer>
</PageContainer>
```

### 3. ContentContainer (필수)

레이아웃과 스타일링을 위한 범용 컨테이너입니다.

**역할:**

- Flexbox 레이아웃
- 패딩, 마진 등 스타일링
- 중첩 가능한 레이아웃 구조

**주요 Props:**

```typescript
type ContentContainerProps = {
  // Size
  width?: SizeValue;
  height?: SizeValue;
  flex?: number;

  // Layout
  useHorizontalLayout?: boolean; // 수평 레이아웃
  gap?: number; // 자식 요소 간격 (기본: 16)
  alignCenter?: boolean; // 중앙 정렬

  // Padding
  withScreenPadding?: boolean; // 화면 기본 패딩 (16px 20px)
  paddingHorizontal?: number;
  paddingVertical?: number;
  paddingTop?: number;
  paddingBottom?: number;

  // Background
  backgroundColor?: string;
  withNoBackground?: boolean; // 배경색 제거
};
```

**사용 예시:**

```tsx
// 기본 패딩
<ContentContainer withScreenPadding>
  {/* 내용 */}
</ContentContainer>

// 수평 레이아웃
<ContentContainer useHorizontalLayout gap={12}>
  <Button />
  <Button />
</ContentContainer>

// 중앙 정렬
<ContentContainer alignCenter>
  <Image />
</ContentContainer>

// 커스텀 패딩
<ContentContainer paddingHorizontal={20} paddingTop={40}>
  {/* 내용 */}
</ContentContainer>
```

### 4. LoadingContainer (레거시)

**⚠️ Deprecated:** `PageContainer`를 사용하세요.

기존 코드와의 호환성을 위해 남아있지만, 새로운 코드에서는 `PageContainer`를 사용하는 것을 권장합니다.

### 5. ScrollContentContainer (레거시)

**⚠️ Deprecated:** `ScrollContainer`를 사용하세요.

기존 코드와의 호환성을 위해 남아있지만, 새로운 코드에서는 `ScrollContainer`를 사용하는 것을 권장합니다.

## 사용 패턴

### 패턴 A: 기본 페이지 (스크롤 없음)

```tsx
const BasicPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <PageContainer isLoading={isLoading}>
      <ContentContainer withScreenPadding>
        <Text>페이지 내용</Text>
      </ContentContainer>
    </PageContainer>
  );
};
```

### 패턴 B: 스크롤 페이지 (키보드 처리 불필요)

```tsx
const ListPage = () => {
  const { isLoading, data, refetch } = useQuery();

  return (
    <PageContainer isLoading={isLoading}>
      <ScrollContainer>
        <ContentContainer withScreenPadding>
          {data.map(item => (
            <ItemCard key={item.id} />
          ))}
        </ContentContainer>
      </ScrollContainer>
    </PageContainer>
  );
};
```

### 패턴 C: 폼 페이지 (키보드 처리 필요)

```tsx
const FormPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <PageContainer isLoading={isLoading}>
      <ScrollContainer keyboardAware>
        <ContentContainer withScreenPadding>
          <TextInput label="이름" />
          <TextInput label="이메일" />
          <TextInput label="비밀번호" secureTextEntry />
          <Button onPress={handleSubmit} />
        </ContentContainer>
      </ScrollContainer>
    </PageContainer>
  );
};
```

### 패턴 D: 복잡한 레이아웃 (헤더 + 스크롤 + 하단 버튼)

```tsx
const ComplexPage = () => {
  const { isLoading, data } = useQuery();

  return (
    <PageContainer isLoading={isLoading}>
      <ContentContainer flex={1}>
        {/* 고정 헤더 */}
        <TopNavigationContainer />

        {/* 스크롤 영역 */}
        <ScrollContainer>
          <ContentContainer withScreenPadding>
            {/* 스크롤 내용 */}
          </ContentContainer>
        </ScrollContainer>

        {/* 고정 하단 버튼 */}
        <ContentContainer withScreenPadding>
          <Button />
        </ContentContainer>
      </ContentContainer>
    </PageContainer>
  );
};
```

### 패턴 E: Pull to Refresh

```tsx
const RefreshablePage = () => {
  const { isLoading, isRefreshing, data, refetch } = useQuery();

  return (
    <PageContainer isLoading={isLoading}>
      <ScrollContainer onRefresh={refetch} refreshing={isRefreshing}>
        <ContentContainer withScreenPadding>{/* 내용 */}</ContentContainer>
      </ScrollContainer>
    </PageContainer>
  );
};
```

## 마이그레이션 가이드

### 기존 패턴 → 새로운 패턴

#### Before: ScreenContainer + LoadingContainer

```tsx
// ❌ 기존 방식
<ScreenContainer edges={['left', 'right', 'bottom']}>
  <LoadingContainer isLoading={isLoading}>
    <ContentContainer withScreenPadding>{/* 내용 */}</ContentContainer>
  </LoadingContainer>
</ScreenContainer>
```

```tsx
// ✅ 새로운 방식
<PageContainer isLoading={isLoading}>
  <ContentContainer withScreenPadding>{/* 내용 */}</ContentContainer>
</PageContainer>
```

#### Before: KeyboardAwareScrollView

```tsx
// ❌ 기존 방식
<ScreenContainer>
  <LoadingContainer isLoading={isLoading}>
    <KeyboardAwareScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
      bottomOffset={20}
    >
      <ContentContainer withScreenPadding>
        <TextInput />
      </ContentContainer>
    </KeyboardAwareScrollView>
  </LoadingContainer>
</ScreenContainer>
```

```tsx
// ✅ 새로운 방식
<PageContainer isLoading={isLoading}>
  <ScrollContainer keyboardAware>
    <ContentContainer withScreenPadding>
      <TextInput />
    </ContentContainer>
  </ScrollContainer>
</PageContainer>
```

#### Before: ScrollContentContainer

```tsx
// ❌ 기존 방식
<ScreenContainer>
  <LoadingContainer isLoading={isLoading}>
    <ScrollContentContainer withScreenPadding>
      {/* 내용 */}
    </ScrollContentContainer>
  </LoadingContainer>
</ScreenContainer>
```

```tsx
// ✅ 새로운 방식
<PageContainer isLoading={isLoading}>
  <ScrollContainer>
    <ContentContainer withScreenPadding>{/* 내용 */}</ContentContainer>
  </ScrollContainer>
</PageContainer>
```

## 베스트 프랙티스

### DO (권장)

✅ 모든 페이지는 `PageContainer`로 시작
✅ 스크롤이 필요하면 `ScrollContainer` 사용
✅ 키보드 처리가 필요하면 `keyboardAware` prop 활성화
✅ `ContentContainer`로 내부 레이아웃 구성
✅ 명확한 계층 구조 유지 (Page → Scroll → Content)

### DON'T (비권장)

❌ `ScreenContainer`와 `LoadingContainer`를 직접 조합하지 마세요 → `PageContainer` 사용
❌ `KeyboardAwareScrollView`를 직접 import하지 마세요 → `ScrollContainer` 사용
❌ `ScrollContentContainer` 사용하지 마세요 → `ScrollContainer` 사용
❌ 불필요한 `ContentContainer` 중첩 피하기
❌ 계층 구조 무시하고 임의로 조합하지 마세요

## 문제 해결

### Q: 키보드가 입력 필드를 가립니다

**A:** `ScrollContainer`에 `keyboardAware` prop을 추가하세요.

```tsx
<ScrollContainer keyboardAware>
  <TextInput />
</ScrollContainer>
```

### Q: 스크롤이 필요한데 키보드 처리는 불필요합니다

**A:** `keyboardAware` prop 없이 `ScrollContainer`를 사용하세요.

```tsx
<ScrollContainer>{/* 내용 */}</ScrollContainer>
```

### Q: Pull to Refresh를 추가하고 싶습니다

**A:** `onRefresh`와 `refreshing` props를 전달하세요.

```tsx
<ScrollContainer onRefresh={refetch} refreshing={isRefreshing}>
  {/* 내용 */}
</ScrollContainer>
```

### Q: 고정 헤더와 스크롤 영역을 함께 사용하고 싶습니다

**A:** `ContentContainer`로 레이아웃을 나누세요.

```tsx
<PageContainer>
  <ContentContainer flex={1}>
    <TopNavigationContainer />
    <ScrollContainer>{/* 스크롤 내용 */}</ScrollContainer>
  </ContentContainer>
</PageContainer>
```

### Q: 에러 발생 시 재시도 버튼을 보여주고 싶습니다

**A:** `PageContainer`의 `isError`와 `onRetry` props를 사용하세요.

```tsx
<PageContainer isLoading={isLoading} isError={isError} onRetry={refetch}>
  {/* 내용 */}
</PageContainer>
```

## 참고

- [Code Style](./CODE_STYLE.md)
- [Folder Structure](./FOLDER_STRUCTURE.md)
- [Navigation](./NAVIGATION.md)
