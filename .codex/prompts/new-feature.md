---
description: Start new feature development from latest main branch
---

main 브랜치로 체크아웃하고 최신 변경사항을 가져온 뒤, 사용자가 요청한 작업 내용을 잘 나타내는 이름으로 새로운 작업 브랜치를 생성하세요.
브랜치명은 `<type>/<ticket-no>-<subject>` 형식을 따르되, 티켓 번호가 전달되지 않은 경우에는 생략합니다.
실행 순서는 아래를 따릅니다:

1. `git checkout main` 후 `git pull --ff-only` 또는 `git fetch && git rebase origin/main`으로 최신화합니다.
2. 사용자 입력으로 받은 기능 설명을 subject로 변환할 때는 kebab-case로 정리합니다(예: "사진 업로드 재시도 추가" → `photo-upload-retry`).
3. 브랜치 생성 예시: `feat/LP-123-photo-upload-retry` 또는 티켓 없을 때 `feat/photo-upload-retry`.
4. 브랜치 생성 후 해당 브랜치로 체크아웃했는지 확인 메시지를 남깁니다.
