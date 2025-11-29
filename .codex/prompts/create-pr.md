---
description: Prep a branch, commit, and open a draft PR
---

현재 브랜치의 변경사항을 분석하고 `.github/PULL_REQUEST_TEMPLATE.md` 템플릿에 맞춰 PR을 생성해주세요.
실행 순서는 아래를 따릅니다:

1. 워킹트리를 확인하고 빠진 커밋이 있다면 Chris Beams 규칙(제목 50자, 명령형, 첫 글자 대문자, 마침표 금지)으로 커밋을 완료합니다.
2. PR 본문을 템플릿 섹션(작업 배경 / 작업 내용 / 참고 사항)에 맞춰 작성하고, UI 변경 시 스크린샷·동영상 링크를 추가합니다.
3. PR 제목도 Chris Beams 스타일로 작성합니다(예: `Add photo upload retry logic`), 커밋 헤더와 동일하게 50자 이내로 맞춥니다.
4. 가능한 경우 최신 main과 리베이스하거나 충돌 여부를 표시합니다. PR은 draft로 생성합니다.
