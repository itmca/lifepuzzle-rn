# Security Guidelines

LifePuzzle React Native 프로젝트 보안 가이드라인

## 민감 데이터 저장

### 인증 토큰 (필수)

인증 토큰(accessToken, refreshToken)은 반드시 `SecureStorage`를 사용하여 저장해야 합니다.

```typescript
// Good - SecureStorage 사용 (암호화 저장)
import { SecureStorage } from '../core/secure-storage.service';
await SecureStorage.setAuthTokens(tokens);

// Bad - LocalStorage 사용 (암호화 없음)
LocalStorage.set('authToken', JSON.stringify(tokens)); // 절대 금지!
```

**저장소 구분:**

| 저장소          | 용도                              | 암호화                              |
| --------------- | --------------------------------- | ----------------------------------- |
| `SecureStorage` | 인증 토큰, 민감 정보              | O (iOS Keychain / Android Keystore) |
| `LocalStorage`  | userNo, onboarding 등 비민감 정보 | X                                   |

### 환경 변수

- `.env`, `.env.develop`, `.env.production`은 절대 git에 커밋하지 않음
- `.gitignore`에 포함되어 있는지 항상 확인
- 시크릿은 CI/CD 환경 변수로 관리 (GitHub Secrets 등)

## 로깅

### Logger 사용 (필수)

`console.log` 대신 반드시 `logger`를 사용해야 합니다.

```typescript
// Good - logger 사용
import logger from '../utils/logger';
logger.debug('Debug info:', data); // 개발 환경에서만 출력
logger.error('Error:', error); // 항상 출력

// Bad - console 직접 사용
console.log(data); // 프로덕션에 노출됨, 절대 금지!
```

**로그 레벨:**

| 메서드           | 환경   | 용도        |
| ---------------- | ------ | ----------- |
| `logger.debug()` | 개발만 | 디버깅 정보 |
| `logger.info()`  | 개발만 | 일반 정보   |
| `logger.warn()`  | 항상   | 경고        |
| `logger.error()` | 항상   | 에러        |

### 로깅 금지 항목

다음 정보는 어떤 레벨에서도 로깅하면 안됩니다:

- 인증 토큰 (accessToken, refreshToken)
- 사용자 비밀번호
- API 키, 시크릿
- 개인정보 (전화번호, 이메일 등)

## WebView 보안

WebView 사용 시 반드시 다음 보안 설정을 적용해야 합니다:

```tsx
<WebView
  source={{ uri: 'https://example.com' }}
  // 필수 보안 설정
  originWhitelist={['https://example.com']}
  allowUniversalAccessFromFileURLs={false}
  allowFileAccessFromFileURLs={false}
  allowFileAccess={false}
  mixedContentMode="never"
  javaScriptEnabled={true}
/>
```

## Deep Link 보안

Deep Link 파라미터는 반드시 검증해야 합니다:

```typescript
// 파라미터 검증 예시
const validateShareKey = (shareKey: string): string => {
  if (!shareKey || typeof shareKey !== 'string') {
    return '';
  }
  // 허용된 문자만 통과
  if (!/^[a-zA-Z0-9-]{1,255}$/.test(shareKey)) {
    return '';
  }
  return shareKey;
};
```

## 의존성 보안

- `npm audit` 주기적 실행
- 취약점 발견 시 즉시 업데이트
- 불필요한 의존성 제거

## 체크리스트

PR 생성 전 확인사항:

- [ ] 인증 토큰이 `SecureStorage`에 저장되는가?
- [ ] `console.log` 대신 `logger`를 사용했는가?
- [ ] 민감 정보가 로그에 포함되지 않는가?
- [ ] WebView에 보안 설정이 적용되었는가?
- [ ] Deep Link 파라미터가 검증되는가?
- [ ] `.env` 파일이 커밋에 포함되지 않았는가?
