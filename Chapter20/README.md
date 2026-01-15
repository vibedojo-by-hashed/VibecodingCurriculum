# Chapter 20: Hooks & Commands

**English** | [한국어](./README.ko.md)

## What You Will Learn

- Creating automation triggers with Hooks
- Saving frequently used prompts with Commands
- Practical automation examples

---

## Why Learn Hooks and Commands?

Configuration alone has limits. Understanding Hooks and Commands gives you:

- **Eliminate repetition**: No need to type the same request every time
- **Workflow automation**: Auto-process before/after specific actions
- **Team standardization**: Whole team works the same way

---

## Hooks System

Hooks are code that automatically runs when specific events occur.

### Hook Types

```
┌─────────────────────────────────────────────────────────────────┐
│                      Hook Execution Points                       │
└─────────────────────────────────────────────────────────────────┘

 User Input
      │
      ▼
┌──────────────────┐
│ UserPromptSubmit │ ← When user presses enter
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│   PreToolUse     │ ← Just before tool execution
└────────┬─────────┘
         │
         ▼
    [Tool Executes]
         │
         ▼
┌──────────────────┐
│   PostToolUse    │ ← Just after tool execution
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│      Stop        │ ← When response completes
└──────────────────┘
```

### Hook Configuration File

```json
// ~/.claude/settings.json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Edit",
        "command": "echo 'Starting file edit: $FILE_PATH'"
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Bash",
        "command": "echo 'Command execution complete'"
      }
    ]
  }
}
```

### Why Does This Matter?

**Auto lint check:**

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit",
        "command": "npm run lint -- --fix $FILE_PATH"
      }
    ]
  }
}
```

Lint runs automatically every time a file is edited.

**Auto testing:**

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit",
        "command": "npm test -- --related $FILE_PATH"
      }
    ]
  }
}
```

Only tests related to the modified file run automatically.

---

## Practical Hook Examples

### 1. File Backup

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Edit",
        "command": "cp $FILE_PATH $FILE_PATH.backup"
      }
    ]
  }
}
```

Automatically creates backup before editing files.

### 2. Change Notification

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write",
        "command": "echo 'New file created: $FILE_PATH' | tee -a ~/.claude/log.txt"
      }
    ]
  }
}
```

Logs file creation.

### 3. Security Check

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "command": "if echo '$COMMAND' | grep -q 'rm -rf'; then exit 1; fi"
      }
    ]
  }
}
```

Blocks dangerous commands before execution.

### 4. Auto Formatting

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

Automatically formats files after editing.

---

## Commands System

Commands save frequently used prompts for reuse.

### Commands Folder Structure

```
.claude/
└── commands/
    ├── commit.md       # /commit command
    ├── review.md       # /review command
    └── test.md         # /test command
```

### Simple Command Example

```markdown
<!-- .claude/commands/commit.md -->
Analyze current changes and write a meaningful commit message.

- Check changes with git diff
- Identify change type (feat, fix, refactor, etc.)
- Write commit message
- Execute git commit
```

Usage:
```
> /commit
```

### Command with Variables

```markdown
<!-- .claude/commands/explain.md -->
Analyze the $ARGUMENTS code.

1. What this code does
2. Important logic
3. Improvements
```

Usage:
```
> /explain src/auth/login.ts
```

### Including Dynamic Information

```markdown
<!-- .claude/commands/status.md -->
Show the current project status.

Current branch: $(git branch --show-current)
Changed files: $(git status --short)

Based on this info:
1. Summarize current work status
2. Suggest next steps
```

Commands inside `$()` are executed and results are inserted.

---

## Practical Command Examples

### 1. Code Review Request

```markdown
<!-- .claude/commands/review.md -->
Review the $ARGUMENTS file.

Check for:
- [ ] Potential bugs
- [ ] Security vulnerabilities
- [ ] Performance issues
- [ ] Code style

Provide specific improvement suggestions.
```

```
> /review src/api/users.ts
```

### 2. Write Tests

```markdown
<!-- .claude/commands/test.md -->
Write tests for $ARGUMENTS.

Requirements:
- Use Jest
- Unit tests first
- Include edge cases
- Test file: *.test.ts
```

```
> /test src/utils/validation.ts
```

### 3. Documentation

```markdown
<!-- .claude/commands/docs.md -->
Write documentation for $ARGUMENTS.

Include:
- Function/class description
- Parameter descriptions
- Return values
- Usage examples

Add to code in JSDoc format.
```

```
> /docs src/services/auth.ts
```

### 4. Refactoring

```markdown
<!-- .claude/commands/refactor.md -->
Refactor $ARGUMENTS.

Principles:
- Improve readability
- Remove duplication
- Split functions (under 20 lines)
- Clear variable names

Show the plan before making changes.
```

```
> /refactor src/components/Dashboard.tsx
```

### 5. Issue → Implementation Workflow

A common pattern in real work. From issue to implementation in one go:

```markdown
<!-- .claude/commands/ticket.md -->
Handle issue #$ARGUMENTS.

## 1. Check Issue
$(gh issue view $ARGUMENTS)

## 2. Create Branch
Create a feature/$ARGUMENTS branch.

## 3. Implementation Plan
Analyze the issue and create an implementation plan.

## 4. Implement
Implement according to the plan.

## 5. Create PR
Create a PR with the changes.
```

```
> /ticket 42
```

One command handles: check issue → create branch → implement → create PR.

---

## Project-Specific Commands

### Frontend Project

```
.claude/
└── commands/
    ├── component.md   # Create component
    ├── hook.md        # Create custom hook
    ├── story.md       # Create Storybook story
    └── style.md       # Add styles
```

```markdown
<!-- .claude/commands/component.md -->
Create a React component named $ARGUMENTS.

Rules:
- Functional component
- TypeScript
- Tailwind CSS
- Define props types

File: src/components/$ARGUMENTS/$ARGUMENTS.tsx
```

### Backend Project

```
.claude/
└── commands/
    ├── endpoint.md    # Create API endpoint
    ├── migration.md   # DB migration
    ├── seed.md        # Seed data
    └── validate.md    # Add input validation
```

```markdown
<!-- .claude/commands/endpoint.md -->
Create CRUD API for $ARGUMENTS resource.

Structure:
- GET /$ARGUMENTS - List
- GET /$ARGUMENTS/:id - Detail
- POST /$ARGUMENTS - Create
- PATCH /$ARGUMENTS/:id - Update
- DELETE /$ARGUMENTS/:id - Delete

Also create the Prisma model.
```

---

## Combining Hooks + Commands

### Commit Workflow Automation

```json
// settings.json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "command": "if echo '$COMMAND' | grep -q 'git commit'; then npm test; fi"
      }
    ]
  }
}
```

```markdown
<!-- .claude/commands/commit.md -->
Commit the changes.

1. Check changes with git diff
2. Run tests (auto-runs via Hook)
3. Write commit message
4. Execute commit
```

This way:
1. Run `/commit`
2. Hook auto-runs tests before commit
3. Commit proceeds if tests pass

### File Creation Workflow

```json
// settings.json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write",
        "command": "npx prettier --write $FILE_PATH && npx eslint --fix $FILE_PATH"
      }
    ]
  }
}
```

```markdown
<!-- .claude/commands/feature.md -->
Create the $ARGUMENTS feature.

After file creation, Hook automatically:
- Prettier formatting
- ESLint fixes

Trust this automation and write code.
```

---

## Sharing Commands with Team

### Commit to Git

```
my-project/
├── .claude/
│   └── commands/     # Team shared Commands
│       ├── commit.md
│       ├── review.md
│       └── deploy.md
├── CLAUDE.md
└── src/
```

Committing `.claude/commands/` to git lets the whole team use the same Commands.

### Document in README

```markdown
# Team Commands

## Available Commands

- `/commit` - Commit changes
- `/review <file>` - Code review
- `/deploy` - Deploy to staging
- `/hotfix <issue>` - Emergency fix
```

---

## Summary

What you learned in this chapter:
- [x] Hooks system (Pre/Post ToolUse, UserPromptSubmit, Stop)
- [x] Reusing prompts with Commands
- [x] Using variables and dynamic information
- [x] Combining Hooks + Commands
- [x] Sharing Commands with team

**Key point**: Automate repetitive work with Hooks and Commands.

In the next chapter, you'll learn more powerful extensions with Agents and Skills.

Proceed to [Chapter 21: Agents & Skills](../Chapter21/README.md).
