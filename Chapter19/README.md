# Chapter 19: Advanced Configuration

**English** | [한국어](./README.ko.md)

## What You Will Learn

- CLAUDE.md 3-tier configuration system
- settings.json detailed options
- Permission management and custom settings

---

## Why Understand Configuration?

Claude Code works well with defaults. But understanding configuration gives you:

- **Consistent work**: No need to repeat the same rules every time
- **Safe usage**: Prevent dangerous actions in advance
- **Custom environment**: Build your own workflow

---

## CLAUDE.md 3-Tier System

Claude Code reads CLAUDE.md files from 3 levels.

### Hierarchy Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                    CLAUDE.md Priority                            │
└─────────────────────────────────────────────────────────────────┘

[1] Project Level (Highest Priority)
    ./CLAUDE.md
    └── Rules specific to current project

[2] Root Level (Medium Priority)
    ~/.claude/CLAUDE.md
    └── Personal rules applied to all projects

[3] User Level (Lowest Priority)
    System defaults
    └── Claude Code default behavior
```

### Why Does This Matter?

**When you need different rules per project:**

```markdown
# Project A's CLAUDE.md
This project uses TypeScript + React.
Tests are written with Jest.

# Project B's CLAUDE.md
This project uses Python + FastAPI.
Tests are written with pytest.
```

**Common rules go in root level:**

```markdown
# ~/.claude/CLAUDE.md
All commit messages are written in English.
Always check for security vulnerabilities during code review.
```

---

## CLAUDE.md Writing Guide

### Characteristics of Good CLAUDE.md

```markdown
# Project Overview
This project is a user authentication service.

# Tech Stack
- Backend: Express.js + TypeScript
- Database: PostgreSQL
- ORM: Prisma

# Coding Conventions
- Function names: camelCase
- File names: kebab-case
- Types: PascalCase

# Common Commands
- npm run dev: Start dev server
- npm test: Run tests
- npm run lint: Check lint

# Important Files
- src/config/: Environment settings
- src/middleware/: Auth, logging middleware
- prisma/schema.prisma: DB schema
```

### Effective Request Tips

```markdown
# Instead of this
"Handle errors well"

# Be specific like this
## Error Handling Rules
- All API responses use { success, data, error } format
- HTTP error codes: only 400/401/403/404/500
- Error logs recorded with winston
```

---

## settings.json Detailed Configuration

### File Location

```
~/.claude/settings.json
```

### Full Structure

```json
{
  "permissions": {
    "autoApprove": [],
    "deny": []
  },
  "model": {
    "default": "sonnet",
    "preferredForPlanning": "opus"
  },
  "behavior": {
    "autoCompact": true,
    "compactThreshold": 80000
  },
  "output": {
    "format": "markdown",
    "verbosity": "normal"
  }
}
```

### Permission Settings

```json
{
  "permissions": {
    // Tools to auto-approve
    "autoApprove": [
      "Read",      // File reading
      "Glob",      // File search
      "Grep",      // Content search
      "WebFetch"   // URL fetching
    ],

    // Patterns to always block
    "deny": [
      "rm -rf",
      "DROP TABLE",
      "force push"
    ]
  }
}
```

### Why Does This Matter?

**Reduce approval fatigue:**

Auto-approving read-only tools means no need to press "y" every time.

```json
{
  "permissions": {
    "autoApprove": ["Read", "Glob", "Grep"]
  }
}
```

**Block dangerous commands:**

Block commands that shouldn't be run by mistake.

```json
{
  "permissions": {
    "deny": [
      "rm -rf /",
      "DROP DATABASE",
      "git push --force origin main"
    ]
  }
}
```

---

## Model Settings

### Specify Default Model

```json
{
  "model": {
    "default": "sonnet"
  }
}
```

### Model Strategy by Task

```json
{
  "model": {
    "default": "sonnet",
    "preferredForPlanning": "opus",
    "preferredForSimpleTasks": "haiku"
  }
}
```

### Why Does This Matter?

**Auto-adjust cost and quality:**

- Complex planning: Opus (quality first)
- General work: Sonnet (balanced)
- Simple tasks: Haiku (speed first)

```
> /model opus
> Design this system architecture

> /model haiku
> Add logging to this function
```

---

## Output Settings

### Format Settings

```json
{
  "output": {
    "format": "markdown",
    "codeBlockStyle": "fenced",
    "verbosity": "normal"
  }
}
```

### Verbosity Control

```json
{
  "output": {
    // "minimal": essentials only
    // "normal": default
    // "verbose": detailed explanations
    "verbosity": "normal"
  }
}
```

---

## Environment-Specific Settings

### Development Environment

```json
// ~/.claude/settings.json (for development)
{
  "permissions": {
    "autoApprove": ["Read", "Glob", "Grep", "Edit", "Write", "Bash"]
  },
  "behavior": {
    "sandbox": false
  }
}
```

### Production Environment

```json
// ~/.claude/settings.json (for production)
{
  "permissions": {
    "autoApprove": ["Read", "Glob", "Grep"],
    "deny": ["rm", "DROP", "DELETE", "force"]
  },
  "behavior": {
    "sandbox": true
  }
}
```

### Why Does This Matter?

**Safety level matching the environment:**

- Development: Auto-approve many things for fast work
- Production: Strict limits to prevent mistakes

---

## Project-Specific Settings

### Using .claude/ Folder

```
my-project/
├── .claude/
│   ├── settings.json    # Project-specific settings
│   └── templates/       # Frequently used prompts
├── CLAUDE.md           # Project rules
└── src/
```

### Project-Specific settings.json

```json
// my-project/.claude/settings.json
{
  "permissions": {
    "autoApprove": ["Read", "Glob", "Grep"],
    "deny": ["npm publish"]
  }
}
```

---

## Practical Configuration Examples

### Frontend Project

```markdown
# CLAUDE.md
## Project
React + TypeScript + Tailwind CSS

## Conventions
- Components are functional
- State management with Zustand
- Styles use Tailwind classes

## Testing
- Test files: *.test.tsx
- Use React Testing Library

## Forbidden
- No any type
- No inline styles
```

```json
// .claude/settings.json
{
  "permissions": {
    "autoApprove": ["Read", "Glob", "Grep"],
    "deny": [": any", "style={{"]
  }
}
```

### Backend Project

```markdown
# CLAUDE.md
## Project
Express + TypeScript + Prisma

## API Rules
- RESTful design
- Response: { success, data, error }
- Auth: JWT Bearer tokens

## Security
- Watch for SQL injection
- Input validation required
- No logging sensitive info

## DB
- Migration: prisma migrate
- Seed: prisma db seed
```

```json
// .claude/settings.json
{
  "permissions": {
    "deny": [
      "DROP TABLE",
      "DELETE FROM",
      "console.log(password",
      "console.log(token"
    ]
  }
}
```

### Full-Stack Project

```markdown
# CLAUDE.md
## Structure
- frontend/: Next.js
- backend/: NestJS
- shared/: Shared types

## Dev Servers
- frontend: npm run dev (port 3000)
- backend: npm run start:dev (port 4000)

## Environment Variables
- .env.local: Local config (not in git)
- .env.example: Template
```

---

## Configuration Debugging

### Check Current Settings

```
> /config
```

Shows currently applied settings.

### When Settings Don't Work

1. **Check file location**: `~/.claude/settings.json`
2. **Check JSON syntax**: commas, quotes, etc.
3. **Restart Claude Code**: May be needed after changes

```bash
# Validate JSON syntax
cat ~/.claude/settings.json | jq .
```

---

## Summary

What you learned in this chapter:
- [x] CLAUDE.md 3-tier system (project/root/user)
- [x] settings.json detailed options
- [x] Permission management (auto-approve/deny)
- [x] Environment-specific settings strategy
- [x] Project-specific custom settings

**Key point**: Good configuration reduces repetitive work and prevents mistakes.

In the next chapter, you'll learn more powerful automation with Hooks and Commands.

Proceed to [Chapter 20: Hooks & Commands](../Chapter20/README.md).
