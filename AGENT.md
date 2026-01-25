# AGENT.md

AI 코딩 에이전트 (Codex, Antigravity 등)를 위한 LifePuzzle RN 가이드

## 시작 전 필수

team-config 최신화:

```bash
cd .team && git pull origin main && cd ..
```

## 핵심 규칙

### Git & 커밋 (Chris Beams 스타일)

- **브랜치**: `<type>/<ticket>-<subject>` (예: `feat/LP-123-auth`)
- **커밋**: 명령형, 50자 이내, 첫 글자 대문자, 마침표 금지

```
Good: Add user authentication
Bad:  Added auth.
```

### PR 제목

- 명령형: Add, Fix, Update, Remove
- 50자 이내
- 타입 접두사 금지 (Refactor: X)

## 프로젝트 개요

**앱**: 소중한 사람들과의 추억을 모으고 기록하는 모바일 앱
**기술스택**: React Native + TypeScript, Recoil, React Navigation

## 구조

```
app/
├── pages/[Domain]/[PageName]/     # 페이지 컴포넌트
├── components/                     # 공통 컴포넌트
├── services/[domain]/              # 서비스 계층
└── utils/                          # 유틸리티
```

## 코딩 규칙

- Hook 순서: Refs → React hooks → Recoil → Navigation → Custom → Handlers → useEffect
- 변수: camelCase, 상수: UPPER_SNAKE_CASE
- **로깅**: console.log 금지 → logger 사용
- **인증 토큰**: SecureStorage 사용 필수

## 명령어

```bash
npm run dev       # 개발 서버
npm test          # 테스트
npm run lint      # 린트
```

## 상세 가이드

- `.team/base/GIT_WORKFLOW.md` - Git 상세 가이드
- `.team/base/PR_RULES.md` - PR 규칙 상세
- `docs/` - 프로젝트별 상세 문서
