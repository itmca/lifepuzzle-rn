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
