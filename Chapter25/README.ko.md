# Chapter 25: 마스터

[English](./README.md) | **한국어**

## 축하합니다!

25개 챕터를 모두 완료했습니다.

이제 여러분은 Claude Code를 활용해 다양한 프로젝트를 만들 수 있습니다.

---

## 배운 것 정리

### Part 1: 시작하기 (Chapter 01-05)

- AI 코딩과 바이브코딩 개념
- Claude Code 설치와 첫 대화
- 파일 읽고 쓰기
- 터미널 명령어

### Part 2: 핵심 기능 (Chapter 06-10)

- 효과적인 프롬프팅
- 코드 탐색하기 (Glob, Grep)
- 코드 편집하기
- Git 기초
- 프로젝트 메모리 (CLAUDE.md)

### Part 3: 실전 I (Chapter 11-14)

- 웹사이트 개발
- 배포하기 (Vercel)
- 데이터 저장
- 미니 게임 만들기

### Part 4: 실전 II (Chapter 15-17)

- CLI 도구 만들기
- 챗봇 만들기
- 풀스택 앱 만들기

### Part 5: 고급 (Chapter 18-25)

- 아키텍처 이해
- 설정 심화
- Hooks & Commands
- Agents & Skills
- MCP 연동
- CI/CD 자동화
- 팀 협업
- 마스터 (지금!)

---

## 핵심 원칙 복습

### 1. 구체적으로 말하기

```
# 나쁜 예
> 버그 고쳐줘

# 좋은 예
> @src/login.js에서 이메일 검증 안 되는 버그 있어.
> "test@" 같은 잘못된 이메일도 통과해.
> 도메인에 점(.)이 있는지 확인하게 고쳐줘.
```

### 2. 단계별로 진행하기

```
# 1단계: 이해
> 이 프로젝트 구조 설명해줘

# 2단계: 계획
> 로그인 기능 어떻게 만들면 좋을까? 코드는 아직 작성하지 마.

# 3단계: 실행
> 좋아, 그 계획대로 만들어줘

# 4단계: 확인
> 테스트해줘
```

### 3. 피드백으로 개선하기

첫 결과가 완벽하지 않아도 괜찮습니다.

```
> 버튼이 너무 작아. 키워줘.
> 색상이 별로야. 파란색으로 바꿔줘.
> 호버 효과 추가해줘.
```

### 4. 설정 활용하기

- **CLAUDE.md**: 프로젝트 규칙
- **Commands**: 자주 쓰는 프롬프트
- **Agents**: 전문 역할
- **Hooks**: 자동화 트리거

### 5. Git으로 안전하게

큰 수정 전에 항상 커밋:

```
> 현재 상태 커밋해줘. 리팩토링 시작 전 백업.
```

---

## 자주 쓰는 워크플로우

### 새 프로젝트 시작

```
1. > 프로젝트 폴더 만들어줘
2. > npm/git 초기화해줘
3. > CLAUDE.md 만들어줘
4. > 기본 파일 구조 만들어줘
```

### 버그 수정

```
1. > 이 에러 메시지 왜 나와? [에러 메시지]
2. > 원인 찾아줘
3. > 고쳐줘
4. > 테스트해줘
```

### 새 기능 추가

```
1. > 이 기능 어떻게 만들면 좋을까?
2. > 그 계획대로 만들어줘
3. > 테스트 추가해줘
4. > 커밋해줘
```

### PR 생성

```
1. > /pr
```

---

## 고급 기능 활용

### Hooks로 자동화

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit",
        "command": "npx prettier --write $FILE_PATH"
      }
    ]
  }
}
```

### MCP로 확장

```json
{
  "servers": {
    "postgres": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-server-postgres"],
      "env": {
        "DATABASE_URL": "postgresql://localhost/mydb"
      }
    }
  }
}
```

### CI/CD로 자동 배포

```yaml
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci && npm test && npm run build
      - run: vercel --prod
```

---

## 다음 단계

### 더 배우고 싶다면

1. **공식 문서**: [docs.anthropic.com](https://docs.anthropic.com)
2. **예제 프로젝트**: GitHub에서 Claude Code 예제 검색
3. **커뮤니티**: 다른 사람들의 사용법 배우기

### 도전해볼 프로젝트

- [ ] 개인 블로그 만들기
- [ ] 할 일 앱 (Full-stack)
- [ ] 실시간 채팅 앱
- [ ] AI 챗봇 서비스
- [ ] 자동화 대시보드
- [ ] 팀용 Claude Code 설정 구축

---

## 마지막 실습: 종합 프로젝트

지금까지 배운 모든 것을 활용해서 하나의 프로젝트를 완성해보세요.

### 추천 프로젝트: 개인 대시보드

```
> 개인 대시보드 만들어줘.
> - 할 일 목록
> - 랜덤 명언 (API)
> - 최근 GitHub 활동 (API)
> - 메모장
>
> localStorage로 데이터 저장
> Vercel로 배포
> CLAUDE.md 잘 작성
> Git으로 버전 관리
```

### 프로젝트 체크리스트

- [ ] 기획: 기능 정의
- [ ] 개발: 하나씩 구현
- [ ] 테스트: 잘 동작하는지 확인
- [ ] 배포: 인터넷에 공개
- [ ] 공유: 다른 사람에게 보여주기

---

## 감사합니다

이 커리큘럼을 완료한 여러분, 정말 대단합니다.

Claude Code와 함께라면 어떤 아이디어도 현실로 만들 수 있습니다.

**기억하세요:**
- 처음부터 완벽할 필요 없습니다
- 피드백으로 계속 개선하면 됩니다
- Claude는 항상 도와줄 준비가 되어 있습니다

---

## 부록: 유용한 링크

### 공식 자료

- [Anthropic 문서](https://docs.anthropic.com)
- [Anthropic 블로그](https://www.anthropic.com/blog)
- [Claude Code GitHub](https://github.com/anthropics/claude-code)

### 참고 자료

- [MDN Web Docs](https://developer.mozilla.org/ko/) - 웹 개발
- [JavaScript.info](https://javascript.info/) - JavaScript 튜토리얼
- [React 공식 문서](https://react.dev/) - React

### 도구

- [Vercel](https://vercel.com) - 배포
- [GitHub](https://github.com) - 코드 저장소
- [GitHub Actions](https://github.com/features/actions) - CI/CD

---

**끝. 이제 나가서 멋진 것들을 만드세요!**
