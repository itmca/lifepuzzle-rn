# React Native 코드 스타일 가이드

## Hook 및 변수 선언 순서

컴포넌트 내부의 변수 선언 및 hook 호출 순서는 다음과 같은 순서를 따릅니다:

1. **Refs**

   ```ts
   const someRef = useRef(...);
   ```

2. **React hooks** (useState, useReducer 등)

   ```ts
   const [count, setCount] = useState(0);
   ```

3. **글로벌 상태 관리 (Zustand, Recoil 등)**

   ```ts
   const user = useUserStore(state => state.user);
   const setUser = useUserStore(state => state.setUser);
   const resetUser = useUserStore(state => state.resetUser);
   ```

4. **외부 hook 호출 (navigation, route 등)**

   ```ts
   const navigation = useNavigation();
   const route = useRoute();
   ```

5. **Memoized 값**

   ```ts
   const expensiveValue = useMemo(...);
   ```

6. **Derived value or local variables (비상태 변수)**

   ```ts
   const isAdmin = user.role === 'admin';
   ```

7. **Custom hooks**

   ```ts
   const { data, refetch } = useCustomQuery(...);
   ```

8. **Custom functions (핸들러, 로직 함수 등)**

   ```ts
   const handleClick = () => { ... };
   const handleClose = () => { ... };
   ```

9. **Side effects (useEffect 등)**
   ```ts
   useEffect(() => {
     ...
   }, []);
   ```

> 💡 위 순서를 통해 가독성을 높이고 일관된 코딩 스타일을 유지할 수 있습니다.

## Reference Stability (참조 안정성)

### 핵심 원칙

**Custom hook이나 useEffect에 배열/객체를 전달할 때는 반드시 참조 안정성을 보장해야 합니다.**

불안정한 참조는 무한 re-render 루프를 일으킬 수 있습니다.

### ❌ 나쁜 예 (금지)

```typescript
const MyComponent = () => {
  const [data, setData] = useState([...]);

  // ❌ 매 렌더마다 새로운 배열 생성 → 무한 루프 위험
  const imageDimensions = useImageDimensions(
    data.map(item => ({ uri: item.url, type: item.type }))
  );

  // ❌ 매 렌더마다 새로운 객체 생성 → 무한 루프 위험
  useEffect(() => {
    fetchData({ filter: 'active', sort: 'desc' });
  }, [{ filter: 'active', sort: 'desc' }]);

  return <View>...</View>;
};
```

### ✅ 좋은 예

```typescript
const MyComponent = () => {
  const [data, setData] = useState([...]);

  // ✅ useMemo로 참조 안정화
  const imageSourcesForDimensions = useMemo(
    () => data.map(item => ({ uri: item.url, type: item.type })),
    [data]
  );
  const imageDimensions = useImageDimensions(imageSourcesForDimensions);

  // ✅ 필요한 값만 dependency로 추가
  const filter = 'active';
  const sort = 'desc';
  useEffect(() => {
    fetchData({ filter, sort });
  }, [filter, sort]);

  return <View>...</View>;
};
```

### 체크리스트

다음 경우에는 **반드시** useMemo/useCallback을 사용하세요:

- [ ] Custom hook에 배열/객체를 전달할 때
- [ ] useEffect dependency에 배열/객체가 포함될 때
- [ ] `.map()`, `.filter()` 등의 결과를 hook에 전달할 때
- [ ] 객체 리터럴 `{}` 또는 배열 리터럴 `[]`을 hook에 전달할 때

### 참조 안정성이 필요한 Custom Hooks

프로젝트의 다음 hook들은 특히 주의가 필요합니다:

- `useImageDimensions(sources, options)` - sources 배열은 반드시 안정적인 참조
- `useStoryWritingDimensions(params)` - params 객체는 반드시 안정적인 참조

> ⚠️ **실제 사례**: StoryDetailPage에서 `filteredGallery.map()`을 직접 `useImageDimensions`에 전달하여 무한 루프 발생. useMemo로 해결함 (PR #223)
