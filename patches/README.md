# Patches

이 폴더는 `patch-package`로 생성된 패치 파일들을 관리합니다.
공식 수정이 릴리즈되면 해당 패치를 삭제하고 라이브러리를 업데이트하세요.

---

## @gorhom+bottom-sheet+5.2.6.patch

### 문제

- React Native 0.82 + New Architecture(Fabric) 환경에서 BottomSheet 렌더링 시 에러 발생
- `TypeError: ref.current.unstable_getBoundingClientRect is not a function`

### 원인

- `useBoundingClientRect.ts`에서 `!== null` 체크 사용
- Fabric에서 일부 View는 `unstable_getBoundingClientRect`가 `undefined`로 반환됨
- `undefined !== null`은 `true`이므로 함수 호출 시도 → 에러

### 해결

- `!== null` → `typeof === 'function'` 체크로 변경

### 삭제 시점

- GitHub Issue: https://github.com/gorhom/react-native-bottom-sheet/issues/2549
- 위 이슈가 해결된 버전이 릴리즈되면 패치 삭제 가능
- 삭제 방법:
  ```bash
  rm patches/@gorhom+bottom-sheet+5.2.6.patch
  npm install @gorhom/bottom-sheet@<fixed-version>
  ```
