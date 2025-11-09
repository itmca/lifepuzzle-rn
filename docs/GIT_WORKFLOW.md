# Git Workflow Guide

## 브랜치 전략

### Trunk Based Development

기본적으로 [Trunk Based Development](https://trunkbaseddevelopment.com/)를 따릅니다.

**브랜치:**

- `main`: 기본 브랜치로 작업 브랜치들이 머지되는 브랜치

### 브랜치 네이밍

```
<type>/<ticket-no>-<subject>
```

**예시:**

- `feat/LP-1-user-authentication`
- `fix/LP-15-photo-upload-bug`
- `refactor/photo-selector-consolidation`

## 커밋 컨벤션

### Chris Beams 스타일

[Chris Beams의 "How to Write a Git Commit Message"](https://chris.beams.io/posts/git-commit/) 스타일을 따릅니다.

### 7가지 규칙

1. **제목과 본문을 빈 줄로 분리**
2. **제목은 50자 이내로 제한**
3. **제목 첫 글자는 대문자로**
4. **제목 끝에 마침표 금지**
5. **제목은 명령형으로 작성** (Add, Fix, Remove)
6. **본문은 72자에서 줄바꿈**
7. **본문에서 무엇을, 왜 했는지 설명**

### 좋은 커밋 메시지 예시

```
Add user authentication system

Implement JWT-based authentication to secure API endpoints.
This replaces the previous session-based auth which had
scalability issues in distributed environments.

- Add JWT token generation and validation
- Update API middleware for token verification
- Add user login/logout endpoints
```

### 나쁜 커밋 메시지 예시

```
fix bug.
added some stuff
Updated README.md
```

### 커밋 분리 원칙

- **각 커밋은 하나의 목적만 가져야 함**
- **기능, 버그수정, 문서, 빌드 등 성격별로 분리하여 커밋**
- **관련 없는 변경사항은 별도 커밋으로 분리**

## 개발 워크플로우

### 기본 플로우

1. `main` 브랜치에서 작업 브랜치 생성

   ```bash
   git checkout main
   git pull origin main
   git checkout -b feat/LP-1-new-feature
   ```

2. 작업 진행 및 커밋

   ```bash
   git add .
   git commit -m "Add new feature implementation"
   ```

3. 작업 완료 후 PR 생성

   ```bash
   git push origin feat/LP-1-new-feature
   ```

4. 리뷰 후 `main` 브랜치로 머지

5. 배포 시 `main` 브랜치에서 배포

6. 배포 후 버전 태그 추가
   ```bash
   git tag v1.1.1
   git push origin v1.1.1
   ```

### Hotfix 플로우

1. 긴급 수정이 필요한 경우 버전 태그에서 `production`과 `hotfix` 브랜치 생성

   ```bash
   git checkout v1.1.1
   git checkout -b production/1.1.2
   git checkout -b hotfix/fix-critical-bug
   ```

2. `hotfix` 브랜치에서 작업 후 `production` 브랜치로 PR

3. `production` 브랜치에서 배포 후 패치 버전 업

   ```bash
   git tag v1.1.2
   ```

4. `production` 브랜치를 `main` 브랜치로 머지

## Pull Request

### PR 템플릿 사용

`.github/PULL_REQUEST_TEMPLATE.md` 템플릿을 참고하여 작성합니다.

### 커스텀 명령어 (Claude Code)

```bash
claude pr
```

PR 템플릿을 참고하여 자동으로 구조화된 PR을 생성합니다.

## 버전 관리

### Semantic Versioning

[Semantic Versioning](https://semver.org/)을 따릅니다.

**형식:** `Major.Minor.Patch` (예: 1.2.3)

- **Major**: 이전 버전과 호환되지 않는 변경
- **Minor**: 새로운 기능 추가/수정/삭제
- **Patch**: 버그 해결 및 기타 수정

### 태그 관리

```bash
# 버전 태그 생성
git tag v1.2.3
git push origin v1.2.3

# 태그 확인
git tag --list

# 특정 태그로 체크아웃
git checkout v1.2.3
```
