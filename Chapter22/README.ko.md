# Chapter 22: MCP 연동

[English](./README.md) | **한국어**

## 이 챕터에서 배우는 것

- MCP(Model Context Protocol) 개념
- 외부 서비스 연결하기
- 실용적인 MCP 서버 활용

---

## 왜 MCP를 알아야 할까?

Claude Code는 기본적으로 파일과 터미널만 다룹니다. MCP를 연결하면:

- **데이터베이스 직접 연결**: SQL 쿼리 실행
- **외부 API 통합**: GitHub, Slack, JIRA 등
- **맞춤형 도구 추가**: 필요한 기능 확장

---

## MCP란?

MCP(Model Context Protocol)는 Claude에게 새로운 능력을 추가하는 표준 프로토콜입니다.

### 기본 구조

```
┌─────────────────────────────────────────────────────────────────┐
│                        MCP 아키텍처                              │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ Claude Code  │ ◀──▶│  MCP Server  │ ◀──▶│ 외부 서비스   │
│              │stdio│              │     │              │
│              │ or  │ (중간 다리)   │     │ DB, API 등   │
│              │HTTP │              │     │              │
└──────────────┘     └──────────────┘     └──────────────┘
```

MCP 서버가 Claude와 외부 서비스 사이에서 통역사 역할을 합니다.

### 이걸 알면 뭐가 좋을까?

**복사-붙여넣기 제거:**

데이터베이스 결과를 복사해서 Claude에게 붙여넣는 대신:

```
> users 테이블에서 최근 가입자 10명 보여줘
```

Claude가 직접 데이터베이스를 조회합니다.

---

## MCP 서버 설정하기

### 설정 파일 위치

```
~/.claude/mcp_servers.json
```

### 기본 구조

```json
{
  "servers": {
    "서버이름": {
      "command": "실행할 명령어",
      "args": ["인자1", "인자2"],
      "env": {
        "환경변수": "값"
      }
    }
  }
}
```

### 예시: PostgreSQL 연결

```json
{
  "servers": {
    "postgres": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-server-postgres"],
      "env": {
        "DATABASE_URL": "postgresql://user:pass@localhost:5432/mydb"
      }
    }
  }
}
```

---

## 자주 쓰는 MCP 서버

### 1. 파일 시스템

```json
{
  "servers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-server-filesystem", "/allowed/path"]
    }
  }
}
```

지정된 경로의 파일에 접근할 수 있습니다.

### 2. PostgreSQL

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

```
> users 테이블 구조 보여줘
> 최근 주문 10개 조회해줘
> 이 사용자의 구매 이력 분석해줘
```

### 3. GitHub

```json
{
  "servers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-server-github"],
      "env": {
        "GITHUB_TOKEN": "ghp_xxxx"
      }
    }
  }
}
```

```
> 이 레포의 최근 PR들 보여줘
> 이슈 #42 내용 확인해줘
> 이 PR에 리뷰 코멘트 달아줘
```

### 4. Slack

```json
{
  "servers": {
    "slack": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-server-slack"],
      "env": {
        "SLACK_TOKEN": "xoxb-xxxx"
      }
    }
  }
}
```

```
> #dev 채널에 배포 완료 메시지 보내줘
> 오늘 #bugs 채널에 올라온 내용 요약해줘
```

---

## 실습: 데이터베이스 연동

### 1. MCP 서버 설정

```json
// ~/.claude/mcp_servers.json
{
  "servers": {
    "postgres": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-server-postgres"],
      "env": {
        "DATABASE_URL": "postgresql://localhost/ecommerce"
      }
    }
  }
}
```

### 2. 실제 사용

```
> 데이터베이스에 어떤 테이블들이 있어?
```

Claude가 직접 스키마를 조회합니다.

```
> orders 테이블에서 이번 달 매출 계산해줘
```

SQL 쿼리를 작성하고 실행합니다.

```
> 가장 많이 팔린 상품 Top 10 분석해줘
```

복잡한 분석도 직접 수행합니다.

### 3. 안전하게 사용하기

**읽기 전용 계정 사용:**

```
DATABASE_URL=postgresql://readonly_user:pass@localhost/mydb
```

**쿼리 제한:**

CLAUDE.md에 규칙 추가:

```markdown
# DB 접근 규칙
- SELECT만 허용
- DELETE, DROP, TRUNCATE 금지
- 대량 UPDATE 전에 반드시 확인 요청
```

---

## 실습: GitHub 연동

### 1. 설정

```json
{
  "servers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-server-github"],
      "env": {
        "GITHUB_TOKEN": "ghp_your_token_here"
      }
    }
  }
}
```

### 2. 활용 예시

**이슈 관리:**

```
> 열린 이슈 중에 버그 라벨 붙은 것들 보여줘
> 이슈 #123 내용 요약해줘
> 이 이슈 해결하려면 어디를 고쳐야 해?
```

**PR 리뷰:**

```
> 이 PR의 변경사항 분석해줘
> 코드 품질 문제가 있으면 알려줘
> 리뷰 코멘트 작성해줘
```

**릴리즈 노트:**

```
> 최근 10개 커밋 분석해서 릴리즈 노트 작성해줘
```

---

## 여러 MCP 서버 조합

### 통합 워크플로우

```json
{
  "servers": {
    "postgres": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-server-postgres"],
      "env": {
        "DATABASE_URL": "postgresql://localhost/mydb"
      }
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-server-github"],
      "env": {
        "GITHUB_TOKEN": "ghp_xxxx"
      }
    },
    "slack": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-server-slack"],
      "env": {
        "SLACK_TOKEN": "xoxb-xxxx"
      }
    }
  }
}
```

### 통합 사용 예시

```
> GitHub 이슈 #42 확인하고, 관련 DB 데이터 분석해서,
> 결과를 #dev 채널에 공유해줘
```

Claude가:
1. GitHub에서 이슈 내용 확인
2. 데이터베이스에서 관련 데이터 조회
3. 분석 결과를 Slack에 전송

---

## 커스텀 MCP 서버 만들기

### 간단한 MCP 서버 구조

```javascript
// my-mcp-server.js
const { Server } = require('@modelcontextprotocol/sdk/server')

const server = new Server({
  name: 'my-custom-server',
  version: '1.0.0'
})

// 도구 정의
server.tool({
  name: 'my_custom_tool',
  description: '내 커스텀 도구',
  inputSchema: {
    type: 'object',
    properties: {
      query: { type: 'string' }
    }
  },
  handler: async ({ query }) => {
    // 도구 로직
    return { result: `처리 결과: ${query}` }
  }
})

server.listen()
```

### 설정에 추가

```json
{
  "servers": {
    "my-custom": {
      "command": "node",
      "args": ["/path/to/my-mcp-server.js"]
    }
  }
}
```

---

## 보안 주의사항

### 1. 토큰 관리

```json
// 나쁜 예 - 하드코딩
{
  "env": {
    "GITHUB_TOKEN": "ghp_actual_token_here"
  }
}

// 좋은 예 - 환경변수 참조
{
  "env": {
    "GITHUB_TOKEN": "${GITHUB_TOKEN}"
  }
}
```

### 2. 권한 최소화

- 읽기 전용 토큰 사용
- 필요한 레포/채널만 접근 허용
- 정기적으로 토큰 갱신

### 3. 민감 데이터 보호

CLAUDE.md에 규칙 추가:

```markdown
# 보안 규칙
- 개인정보 조회 시 목적 확인
- 비밀번호, 토큰 등 민감정보 출력 금지
- 대량 데이터 접근 시 확인 요청
```

---

## 정리

이번 챕터에서 배운 것:
- [x] MCP 개념과 아키텍처
- [x] MCP 서버 설정 방법
- [x] 자주 쓰는 MCP 서버 (DB, GitHub, Slack)
- [x] 여러 서버 조합 사용
- [x] 보안 주의사항

**핵심 포인트**: MCP로 Claude의 능력을 무한 확장할 수 있습니다.

다음 챕터에서는 CI/CD로 자동화 파이프라인을 구축하는 방법을 배웁니다.

[Chapter 23: CI/CD 자동화](../Chapter23/README.ko.md)로 넘어가세요.
