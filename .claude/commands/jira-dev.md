# JIRA 티켓 기반 개발 워크플로우

JIRA 티켓을 기반으로 전체 개발 사이클을 수행합니다: 분석 → 계획 → 구현 → 테스트 → 리뷰 → PR 생성

## 입력

- 티켓 ID: $ARGUMENTS (예: LP-123)

## 환경 변수 (필수)

- JIRA_BASE_URL: JIRA 인스턴스 URL (예: https://your-domain.atlassian.net)
- JIRA_EMAIL: JIRA 계정 이메일
- JIRA_API_TOKEN: JIRA API 토큰

---

## 워크플로우 단계

### 1단계: main 브랜치 최신화

작업 시작 전 main 브랜치를 최신 상태로 업데이트합니다:

```bash
git checkout main
git pull origin main
```

### 2단계: JIRA 티켓 가져오기

다음 curl 명령어로 JIRA 티켓 정보를 가져옵니다:

```bash
curl -s --user "${JIRA_EMAIL}:${JIRA_API_TOKEN}" \
  --header "Content-Type: application/json" \
  --request GET \
  "${JIRA_BASE_URL}/rest/api/3/issue/$ARGUMENTS?expand=renderedFields" | jq .
```

**참고**: 환경 변수에 특수문자가 포함될 수 있으므로 `${VAR}` 형식과 `--user` 옵션을 사용합니다.

티켓에서 다음 정보를 추출하여 분석합니다:

- **제목 (summary)**: 작업의 핵심 목표
- **설명 (description)**: 상세 요구사항, AC(Acceptance Criteria)
- **티켓 타입**: Story, Bug, Task 등
- **우선순위**: 작업 긴급도
- **연결된 티켓**: 관련 작업 확인

### 3단계: 브랜치 생성

티켓 타입에 따라 브랜치를 생성합니다:

- Story/Task: `feature/$ARGUMENTS`
- Bug: `fix/$ARGUMENTS`

```bash
git checkout -b <branch-name>
```

### 4단계: 구현 계획 수립

티켓 요구사항을 분석하여 구현 계획을 수립합니다:

1. **영향 범위 분석**: 수정이 필요한 파일들 식별
2. **구현 단계 분리**: 작은 단위로 작업 분할
3. **테스트 전략**: 필요한 테스트 케이스 정의

TodoWrite 도구를 사용하여 작업 목록을 생성합니다.

### 5단계: 구현

계획에 따라 코드를 구현합니다:

- 기존 코드 스타일과 패턴을 따릅니다
- 각 작업 완료 시 todo를 업데이트합니다
- 필요한 경우 테스트 코드를 함께 작성합니다

### 6단계: 자체 검증

구현 완료 후 검증을 수행합니다:

```bash
# 타입 검사
npx tsc --noEmit

# 테스트 실행
npm test
```

오류가 있으면 수정하고 다시 검증합니다.

### 7단계: 코드 리뷰 (별도 Agent)

**/code-review** 명령을 실행하여 별도 리뷰 agent가 코드를 검토합니다.

리뷰 결과에서 발견된 문제점을 수정합니다:

- Critical/High 이슈는 반드시 수정
- Medium 이슈는 가능하면 수정
- Low/Suggestion은 판단에 따라 적용

리뷰 통과할 때까지 6단계와 7단계를 반복합니다.

### 8단계: PR 생성

모든 검증과 리뷰를 통과하면 PR을 생성합니다.

**/create-pr** 명령을 사용하거나 다음 형식으로 직접 생성:

```bash
gh pr create --title "<PR 제목>" --body "$(cat <<'EOF'
## 작업 배경
- JIRA: [$ARGUMENTS]($JIRA_BASE_URL/browse/$ARGUMENTS)
- <티켓 요약>

## 작업 내용
<변경 사항 상세>

## 테스트
<테스트 방법 및 결과>

## 참고 사항
<리뷰어 참고 사항>
EOF
)"
```

---

## 중요 사항

- 각 단계에서 문제가 발생하면 즉시 사용자에게 알리고 다음 진행 방법을 확인합니다
- 티켓 요구사항이 불명확하면 사용자에게 질문합니다
- 대규모 변경이 예상되면 먼저 계획을 사용자에게 확인받습니다
