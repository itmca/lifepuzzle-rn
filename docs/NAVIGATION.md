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

## 요약

| 상황                         | 사용 방법                 | 이유                               |
| ---------------------------- | ------------------------- | ---------------------------------- |
| `navigate()`, `reset()` 호출 | 매직 스트링               | TypeScript 타입 체크 + 코드 간결성 |
| Navigator 타입 정의          | 상수 (`APP_SCREENS.HOME`) | ParamList 정의 시 오타 방지        |
| Navigator Screen name        | 상수 (`APP_SCREENS.HOME`) | Screen 정의 시 일관성 유지         |
| Deep linking 설정            | 상수                      | 구조적 설정에서 일관성 유지        |

> 💡 **핵심**: TypeScript의 타입 시스템을 신뢰하고, 코드 간결성을 우선시합니다.

## 참고 자료

- [React Navigation TypeScript 공식 문서](https://reactnavigation.org/docs/typescript/)
- [프로젝트 Navigation 타입 정의](../app/navigation/types.tsx)
- [프로젝트 Screen 상수 정의](../app/navigation/screens.constant.ts)
