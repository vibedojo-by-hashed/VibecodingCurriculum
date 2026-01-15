# 바이브코딩 커리큘럼

> AI 네이티브 개발을 위한 체계적인 학습 커리큘럼

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Chapters](https://img.shields.io/badge/챕터-25개-blue.svg)](#커리큘럼-구조)
[![Claude Code](https://img.shields.io/badge/Built%20with-Claude%20Code-blueviolet.svg)](https://github.com/anthropics/claude-code)

[English](./README.md) | **한국어**

---

## 빠른 시작

```bash
# Claude Code 설치
npm install -g @anthropic-ai/claude-code

# Claude Code 실행
claude
```

준비됐나요? [Chapter 01: AI 코딩이란?](./Chapter01/README.ko.md)부터 시작하세요!

---

## 바이브코딩이란?

**바이브코딩**은 AI와 함께 개발하는 새로운 패러다임입니다.

- 코드를 한 줄씩 작성하는 대신 **의도를 표현**
- 혼자 디버깅하는 대신 **대화로 해결**
- AI를 **페어 프로그래머**로 활용
- 품질을 유지하면서 **빠르게 개발**

이 커리큘럼은 Anthropic의 공식 CLI 도구인 Claude Code를 통해 바이브코딩을 학습합니다.

<details>
<summary><strong>바이브코딩의 철학</strong></summary>

### 예전 방식 vs 바이브코딩

**예전에는** 코드를 직접 한 줄씩 작성해야 했습니다. 문법을 외우고, 에러를 수정하고, 검색하고... 학습에 수년이 걸렸습니다.

**지금은 다릅니다.** AI에게 "이런 것을 만들어달라"고 말하면, AI가 코드를 작성합니다.

### 비교: 웹페이지 만들기

**예전 방식:**
```html
<!DOCTYPE html>
<html>
<head>
    <title>내 페이지</title>
    <style>
        body { font-family: sans-serif; }
        h1 { color: blue; }
    </style>
</head>
<body>
    <h1>안녕하세요</h1>
</body>
</html>
```
이 모든 것을 외워서 직접 작성해야 했습니다.

**바이브코딩:**
```
"파란색 제목으로 '안녕하세요'가 나오는 웹페이지 만들어줘"
```
이렇게 말하면 AI가 위 코드를 생성합니다.

### 왜 "바이브"인가?

"Vibe"는 느낌, 분위기라는 뜻입니다. 정확한 문법을 몰라도, 원하는 **"느낌"을 전달**하면 AI가 이해하고 구현한다는 의미입니다.

기존 코딩은 혼자 모든 것을 알아야 했습니다. 바이브코딩은 AI라는 파트너와 **함께 만듭니다**.

</details>

---

## 대상

- 코딩을 처음 배우는 **완전 초보자**
- AI 도구를 활용하고 싶은 **입문 개발자**
- 생산성을 높이고 싶은 **현직 개발자**

코딩 경험이 없어도 됩니다. 처음부터 단계별로 진행합니다.

---

## 학습 성과

25개 챕터를 완료하면 다음을 할 수 있습니다:

- **포트폴리오 웹사이트** 제작 및 배포
- **간단한 앱** (TODO 앱, 게임 등) 개발
- **자동화 도구** (파일 정리, 데이터 처리) 구축
- **AI 서비스** (문서 요약기, 번역기) 구현
- **고급 워크플로우** (Hooks, Skills, MCP, CI/CD) 구성

---

## 커리큘럼 구조

### Part 1: 시작하기 (Chapter 01-05)

기초 개념과 Claude Code 사용법을 학습합니다.

| Chapter | 주제 | 설명 | 링크 |
|---------|------|------|------|
| 01 | AI 코딩이란? | 바이브코딩 개념, Claude Code 소개 | [EN](./Chapter01/README.md) / [KO](./Chapter01/README.ko.md) |
| 02 | 설치하기 | 터미널, 설치, 로그인 | [EN](./Chapter02/README.md) / [KO](./Chapter02/README.ko.md) |
| 03 | 첫 대화 | 권한 모드, 단축키, 슬래시 명령어 | [EN](./Chapter03/README.md) / [KO](./Chapter03/README.ko.md) |
| 04 | 파일 다루기 | @멘션, 파일 읽기/쓰기 | [EN](./Chapter04/README.md) / [KO](./Chapter04/README.ko.md) |
| 05 | 터미널 명령어 | 명령어 실행, 프로젝트 실행 | [EN](./Chapter05/README.md) / [KO](./Chapter05/README.ko.md) |

### Part 2: 핵심 기능 (Chapter 06-10)

Claude Code의 핵심 기능을 익힙니다.

| Chapter | 주제 | 설명 | 링크 |
|---------|------|------|------|
| 06 | 효과적인 프롬프팅 | 좋은 프롬프트, Plan 모드 | [EN](./Chapter06/README.md) / [KO](./Chapter06/README.ko.md) |
| 07 | 코드 탐색하기 | Glob, Grep, 프로젝트 이해 | [EN](./Chapter07/README.md) / [KO](./Chapter07/README.ko.md) |
| 08 | 코드 편집하기 | 탐색→계획→실행 워크플로우 | [EN](./Chapter08/README.md) / [KO](./Chapter08/README.ko.md) |
| 09 | Git 기초 | 커밋, 브랜치, PR | [EN](./Chapter09/README.md) / [KO](./Chapter09/README.ko.md) |
| 10 | 프로젝트 메모리 | CLAUDE.md, 프로젝트 설정 | [EN](./Chapter10/README.md) / [KO](./Chapter10/README.ko.md) |

### Part 3: 실전 프로젝트 I (Chapter 11-14)

실제 프로젝트를 구현합니다.

| Chapter | 주제 | 설명 | 링크 |
|---------|------|------|------|
| 11 | 웹사이트 개발 | 포트폴리오 사이트 만들기 | [EN](./Chapter11/README.md) / [KO](./Chapter11/README.ko.md) |
| 12 | 배포하기 | Vercel, Railway | [EN](./Chapter12/README.md) / [KO](./Chapter12/README.ko.md) |
| 13 | 데이터 저장 | Supabase 연동 | [EN](./Chapter13/README.md) / [KO](./Chapter13/README.ko.md) |
| 14 | 미니 게임 | 재미있는 게임 만들기 | [EN](./Chapter14/README.md) / [KO](./Chapter14/README.ko.md) |

### Part 4: 실전 프로젝트 II (Chapter 15-17)

더 실용적인 프로젝트를 구현합니다.

| Chapter | 주제 | 설명 | 링크 |
|---------|------|------|------|
| 15 | CLI 도구 만들기 | 커맨드라인 도구 개발 | [EN](./Chapter15/README.md) / [KO](./Chapter15/README.ko.md) |
| 16 | 챗봇 만들기 | AI 챗봇 구현 | [EN](./Chapter16/README.md) / [KO](./Chapter16/README.ko.md) |
| 17 | 풀스택 앱 만들기 | 완성형 웹 애플리케이션 | [EN](./Chapter17/README.md) / [KO](./Chapter17/README.ko.md) |

### Part 5: 고급 (Chapter 18-25)

Claude Code의 고급 기능을 학습하고 마스터가 됩니다.

| Chapter | 주제 | 설명 | 링크 |
|---------|------|------|------|
| 18 | 아키텍처 이해 | Claude Code 내부 동작 원리 | [EN](./Chapter18/README.md) / [KO](./Chapter18/README.ko.md) |
| 19 | 설정 심화 | CLAUDE.md 3단계, settings.json | [EN](./Chapter19/README.md) / [KO](./Chapter19/README.ko.md) |
| 20 | Hooks & Commands | 자동화 트리거, 커스텀 명령어 | [EN](./Chapter20/README.md) / [KO](./Chapter20/README.ko.md) |
| 21 | Agents & Skills | 전문화된 AI 어시스턴트 | [EN](./Chapter21/README.md) / [KO](./Chapter21/README.ko.md) |
| 22 | MCP 연동 | 외부 서비스 연결 | [EN](./Chapter22/README.md) / [KO](./Chapter22/README.ko.md) |
| 23 | CI/CD 자동화 | GitHub Actions, 자동 배포 | [EN](./Chapter23/README.md) / [KO](./Chapter23/README.ko.md) |
| 24 | 팀 협업 | 팀 워크플로우, 온보딩 | [EN](./Chapter24/README.md) / [KO](./Chapter24/README.ko.md) |
| 25 | 마스터 | 종합 정리, 최종 프로젝트 | [EN](./Chapter25/README.md) / [KO](./Chapter25/README.ko.md) |

---

## 학습 가이드

### 진행 방법

* 챕터를 **순서대로** 진행하세요. 건너뛰면 이후 내용 이해에 어려움이 있을 수 있습니다.
* 읽기만 하지 말고 **직접 실행**해보세요.
* 한 개의 챕터를 **깊이 있게** 이해하는 것이 여러 챕터를 대충 훑는 것보다 중요합니다.

### 막혔을 때

* 우선 Claude에게 질문하세요. "이게 뭐야?", "왜 이렇게 되는 거야?"
* 24시간 이상 막혀있다면, 이전 챕터 내용을 다시 확인하세요.
* 에러 메시지를 그대로 복사해서 Claude에게 보여주세요.

<details>
<summary><strong>시작 전 마음가짐</strong></summary>

### 1. 완벽하지 않아도 됩니다
처음에는 이상한 결과가 나올 수 있습니다. 다시 말하면 됩니다.

### 2. 에러는 당연합니다
코딩에서 에러는 실패가 아니라 과정입니다. AI가 에러도 수정해줍니다.

### 3. 작게 시작하세요
처음부터 대단한 것을 만들려고 하지 마세요. "Hello World"부터 시작합니다.

### 4. 궁금하면 물어보세요
"이게 뭐야?", "왜 이렇게 해?" AI에게 물어보면 설명해줍니다.

</details>

---

## Pro Tips

Claude Code 팀과 숙련된 개발자들의 팁입니다.

1. **Plan 모드로 시작** - `Shift+Tab` 두 번. 먼저 계획을 세우게 합니다.

2. **검증 방법 명시** - 테스트 실행, 타입 체크 등으로 결과를 확인하게 합니다.

3. **동일한 기준 적용** - AI 코드도 사람 코드처럼 리뷰합니다.

4. **CLAUDE.md를 Git에 저장** - Claude가 실수할 때마다 업데이트합니다.

5. **병렬 작업 활용** - 복잡한 작업은 여러 터미널에서 동시에 진행합니다.

<details>
<summary><strong>추가 팁</strong></summary>

### Claude Code vs 웹 채팅

| 웹 채팅 (ChatGPT, Claude.ai) | Claude Code |
|------------------------------|-------------|
| 코드를 복사해서 파일에 붙여넣어야 함 | 파일을 직접 생성/수정 |
| 로컬 파일 접근 불가 | 프로젝트 전체를 파악 |
| 명령어 실행을 직접 해야 함 | 명령어를 대신 실행 |
| 매번 상황 설명 필요 | 현재 상황을 인지 |

**요약**: 웹 채팅은 "레시피를 알려주는 사람", Claude Code는 "직접 요리하는 셰프"입니다.

### 효과적인 프롬프트 작성

**나쁜 예:**
```
> 버그 고쳐줘
```

**좋은 예:**
```
> @src/login.js에서 로그인 버튼 클릭 시 에러 발생.
> "Cannot read property 'email' of undefined" 에러.
> 수정해줘.
```

구체적으로 작성할수록 좋은 결과가 나옵니다.

</details>

---

## 라이선스

MIT License
