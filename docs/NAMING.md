# Naming Convention

## 파일 네이밍

### React Components

- **TSX 파일**: PascalCase.tsx
  ```
  HomePage.tsx
  UserProfileCard.tsx
  MediaPickerBottomSheet.tsx
  ```

### TypeScript 파일

- **일반 TS 파일**: kebab-case.category.ts
  ```
  user-auth.service.ts
  date-time-display.service.ts
  photo-selector.type.ts
  api-endpoints.constant.ts
  ```

### 폴더 네이밍

- **페이지 폴더**: PascalCase
  ```
  HomePage/
  AccountProfileSelector/
  StoryWritingMain/
  ```
- **기능별 폴더**: kebab-case
  ```
  home-tab/
  no-tab/
  ```

## 변수 및 함수 네이밍

### 변수

- **camelCase 사용**
  ```ts
  const userName = 'john';
  const isAuthenticated = true;
  const photoSelectorConfig = {...};
  ```

### 함수

- **camelCase + 동사로 시작**
  ```ts
  const handleSubmit = () => {...};
  const validateUserInput = () => {...};
  const fetchUserProfile = async () => {...};
  ```

### 상수

- **UPPER_SNAKE_CASE**
  ```ts
  const API_BASE_URL = 'https://api.example.com';
  const MAX_RETRY_COUNT = 3;
  ```

### Custom Hooks

- **use + PascalCase**
  ```ts
  useUserProfile();
  usePhotoSelector();
  useImageUpload();
  ```

### Zustand Store

- **camelCase + Store 접미사**
  ```ts
  const useUserStore = create({...});
  const usePhotoSelectorStore = create({...});
  const useLoadingStore = create({...});
  ```

## 컴포넌트 Props 네이밍

### Props Interface

- **컴포넌트명 + Props**

  ```ts
  interface UserCardProps {
    user: User;
    onEdit: () => void;
  }

  interface MediaPickerBottomSheetProps {
    visible: boolean;
    onClose: () => void;
    config: PhotoSelectorConfig;
  }
  ```

### Event Handler Props

- **on + 동작명**
  ```ts
  (onPress, onClick, onSubmit);
  (onEdit, onDelete, onCreate);
  (onShow, onHide, onToggle);
  ```

## 타입 네이밍

### Interface/Type

- **PascalCase**

  ```ts
  interface User {
    id: string;
    name: string;
  }

  type PhotoSelectorMode = 'single' | 'multiple';
  ```

### Enum

- **PascalCase**
  ```ts
  enum UserRole {
    ADMIN = 'admin',
    USER = 'user',
    GUEST = 'guest',
  }
  ```

## 네이밍 원칙

1. **명확성 우선**: 줄임말보다는 명확한 단어 사용
   - ❌ `usr`, `btn`, `img`
   - ✅ `user`, `button`, `image`

2. **일관성 유지**: 같은 개념은 같은 단어로 표현
   - ❌ `user`와 `member` 혼용
   - ✅ `user`로 통일

3. **컨텍스트 고려**: 폴더/파일 구조에 따라 적절한 네이밍
   - `pages/User/Profile.tsx` (User 폴더 안에서는 Profile만으로 충분)
   - `components/UserProfile.tsx` (공통 컴포넌트에서는 명확하게)
