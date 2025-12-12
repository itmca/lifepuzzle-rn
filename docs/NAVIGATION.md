# Navigation 가이드

## 기본 원칙: 매직 스트링 사용

React Navigation의 타입 체크 시스템을 활용하여 **매직 스트링을 사용**합니다.

### 왜 매직 스트링인가?

1. **TypeScript의 강력한 타입 체크**
   - 전역 타입 선언으로 모든 화면명이 자동 완성 및 타입 체크됨
   - 잘못된 화면명 사용 시 컴파일 에러 발생

2. **코드 간결성**
   - 불필요한 import 제거
   - 중첩된 네비게이션에서 가독성 향상

3. **React Navigation 공식 권장사항**
   - 공식 문서의 모든 예제가 매직 스트링 사용
   - TypeScript 타입 시스템과의 완벽한 통합

## 사용 방법

### ✅ 권장: navigate 호출 시 매직 스트링 사용

```typescript
import { useNavigation } from '@react-navigation/native';
import { AppNavigationProps } from '../../navigation/types';

const MyComponent = () => {
  const navigation = useNavigation<AppNavigationProps<'Home'>>();

  const handlePress = () => {
    // ✅ 매직 스트링 사용
    navigation.navigate('App', {
      screen: 'StoryViewNavigator',
      params: {
        screen: 'Story',
      },
    });
  };

  return <Button onPress={handlePress} />;
};
```

### ✅ navigation.reset도 동일

```typescript
// ✅ 매직 스트링 사용
navigation.reset({
  index: 0,
  routes: [
    {
      name: 'Auth',
      params: {
        screen: 'LoginRegisterNavigator',
        params: {
          screen: 'LoginMain',
        },
      },
    },
  ],
});
```

### ❌ 비권장: 상수 사용

```typescript
// ❌ 불필요하게 복잡함
import {
  ROOT_SCREENS,
  APP_SCREENS,
  STORY_VIEW_SCREENS,
} from '../../navigation/screens.constant';

navigation.navigate(ROOT_SCREENS.APP, {
  screen: APP_SCREENS.STORY_VIEW_NAVIGATOR,
  params: {
    screen: STORY_VIEW_SCREENS.STORY,
  },
});
```

**문제점:**

- 여러 상수 파일 import 필요
- 코드 길이 증가
- 상수와 타입을 중복 관리해야 함
- 상수 import 시 잘못된 상수를 가져올 수 있음

## 상수 사용 예외

### 1. Navigator 타입 정의

Navigator의 ParamList 타입 정의 시에만 상수를 사용합니다.

```typescript
import { APP_SCREENS } from '../screens.constant';

// ✅ Navigator 정의: 상수 사용 (오타 방지)
export type AppParamList = {
  [APP_SCREENS.HOME]: undefined;
  [APP_SCREENS.STORY_VIEW_NAVIGATOR]: NavigatorScreenParams<StoryViewParamList>;
  [APP_SCREENS.AI_PHOTO_NAVIGATOR]: NavigatorScreenParams<AiPhotoParamList>;
};

const Stack = createNativeStackNavigator<AppParamList>();

const AppNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={APP_SCREENS.HOME}  // ✅ Navigator 정의: 상수 사용
        component={HomePage}
      />
    </Stack.Navigator>
  );
};
```

### 2. Deep Linking 설정

Deep linking 설정에서는 상수를 사용합니다.

```typescript
import {
  ROOT_SCREENS,
  APP_SCREENS,
  HERO_SETTING_SCREENS,
} from '../../navigation/screens.constant';

export const useLinking = () => {
  return {
    prefixes: ['https://lifepuzzle.itmca.io', 'lifepuzzle://'],
    config: {
      screens: {
        // ✅ Deep linking 설정: 상수 사용
        [ROOT_SCREENS.APP]: {
          screens: {
            [APP_SCREENS.HERO_SETTING_NAVIGATOR]: {
              screens: {
                [HERO_SETTING_SCREENS.HERO_SETTING]: {
                  path: 'share/hero',
                },
              },
            },
          },
        },
      },
    },
  };
};
```

## TypeScript 타입 안전성

### 전역 타입 선언

`app/navigation/types.tsx`에 전역 타입이 선언되어 있습니다:

```typescript
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
```

이를 통해 모든 `navigation.navigate()` 호출에서 자동으로 타입 체크가 됩니다.

### 타입 체크 예시

```typescript
// ✅ 올바른 화면명 - 타입 체크 통과
navigation.navigate('App', { screen: 'Home' });

// ❌ 잘못된 화면명 - 컴파일 에러
navigation.navigate('App', { screen: 'WrongScreen' });
// Error: Argument of type '"WrongScreen"' is not assignable to parameter...

// ✅ 자동 완성 지원
navigation.navigate('App', {
  screen: 'Story...', // IDE가 자동 완성 제공
});
```

## Navigator에서 Store 구독 패턴

### 핵심 원칙: 액션 함수만 구독, 상태값은 getState() 사용

Navigator 컴포넌트에서 Zustand store를 구독할 때는 **불필요한 re-render를 방지**하기 위해 다음 패턴을 따릅니다.

### ❌ 나쁜 예: 상태값 직접 구독

```typescript
const StoryWritingNavigator = () => {
  // ❌ Navigator가 상태값을 구독하면 값 변경 시마다 re-render 발생
  const selectedStoryKey = useStoryStore(state => state.selectedStoryKey);
  const selectedGalleryItems = useSelectionStore(
    state => state.selectedGalleryItems,
  );
  const editGalleryItems = useSelectionStore(state => state.editGalleryItems);
  const setSelectedGalleryItems = useSelectionStore(
    state => state.setSelectedGalleryItems,
  );

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="StoryWritingMain"
        component={StoryWritingPage}
        options={{
          header: () => (
            <TopBar
              title={selectedStoryKey ? '수정하기' : '작성하기'}
              right={<WritingHeaderRight text="등록" />}
            />
          ),
        }}
      />
    </Stack.Navigator>
  );
};
```

**문제점**:

- Navigator가 `selectedStoryKey`, `selectedGalleryItems`, `editGalleryItems` 구독
- 이 값들이 변경될 때마다 Navigator 컴포넌트가 re-render
- 현재 focus되지 않은 화면의 Navigator도 불필요하게 re-render

### ✅ 좋은 예: 액션 함수만 구독, 값은 getState() 사용

```typescript
const StoryWritingNavigator = () => {
  // ✅ 액션 함수만 구독 (함수는 참조가 안정적이므로 re-render 없음)
  const setSelectedGalleryItems = useSelectionStore(
    state => state.setSelectedGalleryItems,
  );
  const setEditGalleryItems = useSelectionStore(
    state => state.setEditGalleryItems,
  );

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="StoryWritingMain"
        component={StoryWritingPage}
        options={{
          header: () => {
            // ✅ 헤더 렌더링 시점에만 값 읽기
            const selectedStoryKey = useStoryStore.getState().selectedStoryKey;
            return (
              <TopBar
                title={selectedStoryKey ? '수정하기' : '작성하기'}
                right={<WritingHeaderRight text="등록" />}
              />
            );
          },
        }}
      />
    </Stack.Navigator>
  );
};
```

**장점**:

- Navigator는 액션 함수만 구독하므로 re-render 없음
- 상태값은 헤더가 실제로 렌더링될 때만 `getState()`로 읽음
- 불필요한 re-render 완전히 제거

### customAction에서 값 사용하기

```typescript
<Stack.Screen
  name="PhotoEditor"
  component={PhotoEditor}
  options={{
    header: () => {
      // ✅ 헤더 렌더링 시점에 값 읽기
      const editGalleryItems = useSelectionStore.getState().editGalleryItems;
      return (
        <TopBar
          title="사진 편집"
          right={
            <WritingHeaderRight
              text="업로드"
              customAction={() => {
                // ✅ 액션 실행 시점에 최신 값 사용
                setSelectedGalleryItems([...editGalleryItems]);
                uploadGallery();
              }}
            />
          }
        />
      );
    },
  }}
/>
```

### 언제 구독해야 하는가?

| 항목                               | 구독 여부     | 이유                                    |
| ---------------------------------- | ------------- | --------------------------------------- |
| 액션 함수 (`setState`, `reset` 등) | ✅ 구독       | 함수 참조는 안정적이므로 re-render 없음 |
| 상태값 (헤더에서만 사용)           | ❌ 구독 안 함 | `getState()`로 필요한 시점에만 읽기     |
| 상태값 (Navigator UI 변경용)       | ✅ 구독       | Navigator 자체 UI가 변해야 하는 경우만  |

### 성능 영향

**Before** (상태값 구독):

```
상태 변경 → Navigator re-render → 모든 Screen options 재평가 → 불필요한 연산
```

**After** (getState() 사용):

```
상태 변경 → Navigator re-render 없음 → 헤더 렌더링 시에만 값 읽기 → 최소한의 연산
```

> ⚠️ **주의**: Page 컴포넌트 내부에서는 일반적인 구독 패턴을 사용하세요. 이 최적화는 Navigator 컴포넌트에만 적용됩니다.

## 요약

| 상황                         | 사용 방법                      | 이유                               |
| ---------------------------- | ------------------------------ | ---------------------------------- |
| `navigate()`, `reset()` 호출 | 매직 스트링                    | TypeScript 타입 체크 + 코드 간결성 |
| Navigator 타입 정의          | 상수 (`APP_SCREENS.HOME`)      | ParamList 정의 시 오타 방지        |
| Navigator Screen name        | 상수 (`APP_SCREENS.HOME`)      | Screen 정의 시 일관성 유지         |
| Deep linking 설정            | 상수                           | 구조적 설정에서 일관성 유지        |
| Navigator store 구독         | 액션 함수만, 값은 `getState()` | 불필요한 re-render 방지            |

> 💡 **핵심**: TypeScript의 타입 시스템을 신뢰하고, 코드 간결성을 우선시합니다.

## 참고 자료

- [React Navigation TypeScript 공식 문서](https://reactnavigation.org/docs/typescript/)
- [프로젝트 Navigation 타입 정의](../app/navigation/types.tsx)
- [프로젝트 Screen 상수 정의](../app/navigation/screens.constant.ts)
