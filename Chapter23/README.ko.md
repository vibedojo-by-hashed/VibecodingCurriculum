# Chapter 23: CI/CD 자동화

[English](./README.md) | **한국어**

## 이 챕터에서 배우는 것

- CI/CD 개념과 필요성
- GitHub Actions로 자동화 구축
- Claude Code를 파이프라인에 통합

---

## 왜 CI/CD를 알아야 할까?

수동 작업은 실수와 시간 낭비를 유발합니다:

```
수동:
1. 코드 수정
2. 테스트 실행 (잊어버림)
3. 빌드 (오류 발생)
4. 다시 수정
5. 배포 (설정 누락)
...

자동화:
1. 코드 수정
2. 나머지는 자동!
```

---

## CI/CD란?

### 기본 개념

```
┌─────────────────────────────────────────────────────────────────┐
│                        CI/CD 파이프라인                          │
└─────────────────────────────────────────────────────────────────┘

     코드 푸시
         │
         ▼
┌──────────────┐
│     CI       │  ← Continuous Integration
│  (자동 테스트) │
└──────┬───────┘
       │ 통과
       ▼
┌──────────────┐
│    Build     │
│  (빌드)      │
└──────┬───────┘
       │ 성공
       ▼
┌──────────────┐
│     CD       │  ← Continuous Deployment
│  (자동 배포)  │
└──────────────┘
```

- **CI**: 코드 변경 시 자동 테스트
- **CD**: 테스트 통과 시 자동 배포

---

## GitHub Actions 기초

### 워크플로우 파일 위치

```
.github/
└── workflows/
    ├── ci.yml        # CI 워크플로우
    ├── deploy.yml    # 배포 워크플로우
    └── review.yml    # 코드 리뷰 워크플로우
```

### 기본 구조

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test
```

---

## 실용적인 워크플로우 예시

### 1. 기본 CI 파이프라인

```yaml
name: CI

on: [push, pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run lint

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm test

  build:
    needs: [lint, test]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
```

### 2. 자동 배포

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Deploy to Vercel
        run: |
          npm install -g vercel
          vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

### 3. PR 리뷰 자동화

```yaml
name: PR Review

on: [pull_request]

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Run Claude Code Review
        uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          prompt: |
            이 PR을 리뷰해주세요:
            - 버그 가능성
            - 보안 취약점
            - 코드 품질
```

---

## Claude Code를 CI에서 사용하기

### 헤드리스 모드

`-p` 플래그로 스크립트에서 Claude를 실행할 수 있습니다:

```bash
# 기본 사용
claude -p "이 프로젝트 요약해줘"

# 특정 도구만 허용
claude -p "코드 분석해줘" --allowedTools "Read,Glob,Grep"

# JSON 출력
claude -p "함수 목록 추출해줘" --output-format json
```

### CI에서 코드 리뷰

```yaml
- name: Claude Code Review
  run: |
    # 변경된 파일 목록 가져오기
    CHANGED_FILES=$(git diff --name-only HEAD~1)

    # Claude로 리뷰
    claude -p "다음 파일들을 리뷰해줘: $CHANGED_FILES" \
      --allowedTools "Read,Glob,Grep"
```

### 자동 문서 생성

```yaml
- name: Generate Docs
  run: |
    claude -p "src/ 폴더의 함수들에 대한 문서 생성해줘" \
      --allowedTools "Read,Write,Glob"

    git add docs/
    git commit -m "docs: auto-generated documentation"
    git push
```

---

## 실전 파이프라인 구축

### 완전한 CI/CD 예시

```yaml
name: Full Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  # 1. 코드 품질 검사
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check

  # 2. 테스트
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm test -- --coverage

  # 3. 빌드
  build:
    needs: [quality, test]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-artifact@v4
        with:
          name: build
          path: dist/

  # 4. 배포 (main 브랜치만)
  deploy:
    if: github.ref == 'refs/heads/main'
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/download-artifact@v4
        with:
          name: build
      - run: vercel --prod --token=${{ secrets.VERCEL_TOKEN }}

  # 5. 알림
  notify:
    needs: deploy
    runs-on: ubuntu-latest
    steps:
      - name: Slack Notification
        run: |
          curl -X POST ${{ secrets.SLACK_WEBHOOK }} \
            -H 'Content-type: application/json' \
            -d '{"text": "배포 완료!"}'
```

---

## 보안 관리

### Secrets 설정

GitHub Settings → Secrets and variables → Actions에서 설정:

- `ANTHROPIC_API_KEY`: Claude API 키
- `VERCEL_TOKEN`: Vercel 배포 토큰
- `SLACK_WEBHOOK`: Slack 알림 URL

### 권한 제한

```yaml
- name: Read-only Claude
  run: |
    claude -p "코드 분석해줘" \
      --allowedTools "Read,Glob,Grep"  # 쓰기 도구 제외
```

---

## 비용 최적화

### 변경된 파일만 처리

```yaml
- name: Get changed files
  id: changed
  run: |
    echo "files=$(git diff --name-only HEAD~1)" >> $GITHUB_OUTPUT

- name: Review only changed
  run: |
    claude -p "이 파일들만 리뷰해줘: ${{ steps.changed.outputs.files }}"
```

### 캐싱 활용

```yaml
- name: Cache dependencies
  uses: actions/cache@v4
  with:
    path: node_modules
    key: npm-${{ hashFiles('package-lock.json') }}
```

---

## 정리

이번 챕터에서 배운 것:
- [x] CI/CD 개념 (자동 테스트, 자동 배포)
- [x] GitHub Actions 기본 구조
- [x] 실용적인 워크플로우 예시
- [x] Claude Code CI 통합
- [x] 보안과 비용 최적화

**핵심 포인트**: 자동화는 한 번 설정하면 계속 가치를 제공합니다.

다음 챕터에서는 팀에서 Claude Code를 효과적으로 활용하는 방법을 배웁니다.

[Chapter 24: 팀 협업](../Chapter24/README.ko.md)으로 넘어가세요.
