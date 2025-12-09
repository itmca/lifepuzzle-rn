# Service Layer 가이드

## 기본 원칙: 객체 네임스페이스 사용

React/React Native에서는 **클래스 대신 함수형 패턴**을 권장합니다. 순수 함수의 모음은 **객체 리터럴(Object Namespace)**로 구현합니다.

### 왜 객체 네임스페이스인가?

1. **React 생태계와의 일관성**
   - React는 함수형 컴포넌트와 Hooks를 기본으로 사용
   - 서비스 레이어도 함수형 패턴으로 일관성 유지

2. **Tree-shaking 최적화**
   - 객체 리터럴은 번들러가 사용하지 않는 메서드를 제거하기 쉬움
   - 번들 크기 감소

3. **간결성과 가독성**
   - `static` 키워드 불필요
   - 더 직관적인 구조

4. **TypeScript 권장사항**
   - TypeScript 공식 문서에서 namespace 대신 객체 리터럴 권장
   - 더 나은 타입 추론

## 사용 방법

### ✅ 권장: 객체 네임스페이스

```typescript
// app/services/example/example.service.ts

/**
 * 예제 서비스
 * 순수 함수들의 모음
 */
export const ExampleService = {
  /**
   * 문자열을 대문자로 변환
   */
  toUpperCase(text: string): string {
    return text.toUpperCase();
  },

  /**
   * 숫자를 2배로 변환
   */
  double(value: number): number {
    return value * 2;
  },

  /**
   * 배열의 합계 계산
   */
  sum(numbers: number[]): number {
    return numbers.reduce((acc, num) => acc + num, 0);
  },
} as const;
```

**사용 예시:**

```typescript
import { ExampleService } from '../services/example/example.service';

const result = ExampleService.toUpperCase('hello'); // 'HELLO'
const doubled = ExampleService.double(5); // 10
```

### ✅ Private 함수가 필요한 경우

객체 외부에 헬퍼 함수를 선언합니다:

```typescript
// app/services/hero/hero-payload.service.ts

// Private 헬퍼 함수 (export하지 않음)
const addHeroPhoto = (
  formData: FormData,
  writingHero: WritingHeroType | undefined,
): void => {
  const photo = writingHero?.modifiedImage;
  if (photo?.node?.image?.uri) {
    PayloadBuilder.addPhotoToFormData(formData, 'photo', photo, IMG_TYPE);
  }
};

const addHeroData = (
  formData: FormData,
  writingHeroKey: number,
  writingHero: WritingHeroType | undefined,
): void => {
  // 구현...
};

// Public API
export const HeroPayloadService = {
  createHeroFormData(
    writingHeroKey: number,
    writingHero: WritingHeroType | undefined,
  ): FormData {
    const formData = PayloadBuilder.createFormData();

    addHeroPhoto(formData, writingHero);
    addHeroData(formData, writingHeroKey, writingHero);

    return formData;
  },
} as const;
```

### ❌ 비권장: Static 클래스

```typescript
// ❌ 사용하지 마세요
export class ExampleService {
  static toUpperCase(text: string): string {
    return text.toUpperCase();
  }

  static double(value: number): number {
    return value * 2;
  }

  private static helper(): void {
    // private 메서드
  }
}
```

**문제점:**

- `static` 키워드로 인한 불필요한 복잡도
- React 생태계와 맞지 않는 OOP 패턴
- Tree-shaking 최적화 어려움
- 클래스 인스턴스를 생성하지 않는데도 클래스 문법 사용

## 클래스 사용 예외

다음 경우에만 클래스를 사용합니다:

### 1. 내부 상태를 가진 Storage 계층

```typescript
// ✅ 내부 상태(MMKV 인스턴스)를 가지므로 클래스 사용
export class LocalStorage {
  private static storage = new MMKV();

  static set(key: LocalStorageKey, value: string | number | boolean) {
    this.storage.set(key, value);
  }

  static get(key: LocalStorageKey, valueType: ValueType) {
    if (valueType === 'string') {
      return this.storage.getString(key);
    }
    // ...
  }
}
```

### 2. 인스턴스 생성이 필요한 경우

```typescript
// ✅ 각 인스턴스가 독립적인 상태를 가지는 경우
export class ImageProcessor {
  private canvas: Canvas;

  constructor(width: number, height: number) {
    this.canvas = createCanvas(width, height);
  }

  process(image: Image): Image {
    // 인스턴스 상태를 사용한 처리
    return processWithCanvas(this.canvas, image);
  }
}
```

## 프로젝트의 서비스 구조

### Storage 계층 (클래스 사용)

내부 상태를 가지므로 클래스 유지:

- `LocalStorage` - MMKV 인스턴스 보유
- `SecureStorage` - Keychain 래핑

### 유틸리티 계층 (객체 네임스페이스)

순수 함수 모음:

- `HttpService` - Axios 인스턴스 생성 및 설정
- `FormValidationService` - 폼 검증 로직

### Payload 계층 (객체 네임스페이스)

FormData 생성 로직:

- `HeroPayloadService` - Hero FormData 생성
- `StoryPayloadService` - Story FormData 생성
- `UserPayloadService` - User FormData 생성

### Factory 계층 (객체 네임스페이스)

객체 생성 로직:

- `StoryFormFactory` - WritingStory 객체 생성

### Navigation 계층 (객체 네임스페이스)

비즈니스 로직 + 네비게이션:

- `StoryNavigationService` - Story 작성/수정 네비게이션

## 네이밍 규칙

### 파일명

- 패턴: `{domain}-{category}.service.ts` 또는 `{domain}.{category}.ts`
- 예시:
  - `hero-payload.service.ts`
  - `story-form.factory.ts`
  - `form-validation.service.ts`

### 객체명

- 패턴: `{Domain}{Category}` (PascalCase)
- 예시:
  - `HeroPayloadService`
  - `StoryFormFactory`
  - `FormValidationService`

### 메서드명

- 동사로 시작 (camelCase)
- 명확하고 구체적인 이름 사용
- 예시:
  - `createHeroFormData()`
  - `fromGalleryItem()`
  - `validateNickname()`

## 마이그레이션 가이드

기존 static 클래스를 객체 네임스페이스로 변환하는 방법:

### Before (클래스)

```typescript
export class MyService {
  static method1(param: string): string {
    return this.helper(param);
  }

  private static helper(param: string): string {
    return param.toUpperCase();
  }
}
```

### After (객체 네임스페이스)

```typescript
// Private 헬퍼 함수를 모듈 레벨로 추출
const helper = (param: string): string => {
  return param.toUpperCase();
};

// Public API만 export
export const MyService = {
  method1(param: string): string {
    return helper(param);
  },
} as const;
```

**변경 사항:**

1. `class` → `const` 객체 리터럴
2. `static` 키워드 제거
3. `private static` 메서드 → 모듈 레벨 함수 (export 하지 않음)
4. `this.helper()` → `helper()` (직접 호출)
5. `as const` 추가 (불변성 보장)

## 요약

| 상황                | 사용 방법         | 이유                            |
| ------------------- | ----------------- | ------------------------------- |
| 순수 함수 모음      | 객체 네임스페이스 | React 패턴 일관성, Tree-shaking |
| 내부 상태 보유      | 클래스 (static)   | 상태 캡슐화 필요                |
| 인스턴스 생성 필요  | 클래스 (instance) | 각 인스턴스별 독립 상태         |
| Private 메서드 필요 | 모듈 레벨 함수    | export 제어로 캡슐화            |

> 💡 **핵심**: 대부분의 서비스는 객체 네임스페이스로 구현하고, 내부 상태가 필요한 경우에만 클래스를 사용합니다.

## 참고 자료

- [React 공식 문서 - Hooks](https://react.dev/reference/react)
- [TypeScript 공식 문서 - Namespaces and Modules](https://www.typescriptlang.org/docs/handbook/namespaces-and-modules.html)
- [프로젝트 서비스 예시](../app/services/)
