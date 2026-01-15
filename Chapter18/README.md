# Chapter 18: Understanding the Architecture

**English** | [한국어](./README.ko.md)

## What You Will Learn

- How Claude Code works under the hood
- Understanding the tool system
- Using this knowledge to make better requests

---

## Why Understand the Architecture?

Thinking of Claude Code as "magic" has limitations. Understanding how it works gives you:

- **More accurate requests**: Predict which tools will be used
- **Problem solving**: Figure out why something isn't working
- **Efficient usage**: Reduce unnecessary operations

---

## Claude Code's Overall Structure

### At a Glance

```
┌─────────────────────────────────────────────────────────────────┐
│                        You (Terminal)                            │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                       Claude Code CLI                            │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────────┐    │
│  │ Input Handler │  │ Tool Engine   │  │  Output Renderer  │    │
│  └───────────────┘  └───────────────┘  └───────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Anthropic API (Claude)                        │
│               Models: opus / sonnet / haiku available            │
└─────────────────────────────────────────────────────────────────┘
```

**Key point**: Claude doesn't run directly on your computer. It communicates through the API, and only tool execution happens locally.

### API Communication Cycle

Let's see what happens when you make a request:

```
 [1] Your request                     [2] Sent to API
      │                                 │
      ▼                                 ▼
┌──────────┐    Message + Tool Defs   ┌─────────────┐
│ CLI      │ ─────────────────────▶ │ Anthropic   │
│ Client   │                        │ API         │
└──────────┘                        └─────────────┘
      ▲                                 │
      │     Response (text + tool call) │
      └─────────────────────────────────┘
                    [3]

 [4] Tool executed locally            [5] Results back to API
      │                                 │
      ▼                                 ▼
┌──────────────────┐              ┌─────────────┐
│ Bash, Read, etc. │ ───────────▶ │ Claude      │
│ executed         │              │ decides next│
└──────────────────┘              └─────────────┘
```

### Why Does This Matter?

```
> Show me all files in this folder
```

When you make this request:
1. Claude uses `Glob` tool to list files → 1 API round trip
2. Receives results and decides next action → 2 API round trips
3. Uses `Read` if needed to view contents → 3 API round trips

**One request = multiple API round trips**. Being specific reduces round trips and speeds things up.

---

## The Tool System

Claude Code uses 18 built-in tools.

### Tool Categories

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              Tool Execution Layer                            │
│                                                                             │
│  File Operations ───────────────────────────────────────────────────────    │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐              │
│  │  Read   │ │  Write  │ │  Edit   │ │  Glob   │ │  Grep   │              │
│  │ read    │ │ create  │ │ modify  │ │ search  │ │ content │              │
│  │ files   │ │ files   │ │ files   │ │ files   │ │ search  │              │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘              │
│                                                                             │
│  Execution ─────────────────────────────────────────────────────────────    │
│  ┌─────────┐ ┌─────────────────┐                                           │
│  │  Bash   │ │     Task        │                                           │
│  │ run     │ │ (subagents)     │                                           │
│  │ commands│ │                 │                                           │
│  └─────────┘ └─────────────────┘                                           │
│                                                                             │
│  Web ───────────────────────────────────────────────────────────────────    │
│  ┌─────────┐ ┌─────────┐                                                   │
│  │WebFetch │ │WebSearch│                                                   │
│  │fetch URL│ │web      │                                                   │
│  │         │ │search   │                                                   │
│  └─────────┘ └─────────┘                                                   │
│                                                                             │
│  Other ─────────────────────────────────────────────────────────────────    │
│  ┌─────────┐ ┌─────────┐ ┌───────────────┐ ┌───────────────┐              │
│  │TodoWrite│ │  Skill  │ │ EnterPlanMode │ │AskUserQuestion│              │
│  │task mgmt│ │run skill│ │  plan mode    │ │ ask user      │              │
│  └─────────┘ └─────────┘ └───────────────┘ └───────────────┘              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Tool Execution Flow

When a tool is called, it's processed like this:

```
    Claude Response
         │
         ▼
  ┌──────────────┐
  │ Parse        │
  │ Response     │
  │ (text +      │
  │  tool calls) │
  └──────┬───────┘
         │
    ┌────┴────┐
    ▼         ▼
┌────────┐ ┌────────┐
│ Text   │ │ Tool   │
│ Output │ │ Execute│
└────────┘ └───┬────┘
               │
         ┌─────┴─────┐
         ▼           ▼
    ┌────────┐  ┌────────┐
    │ Success│  │ Failure│
    │ Result │  │ Error  │
    └───┬────┘  └───┬────┘
        │           │
        └─────┬─────┘
              ▼
    ┌─────────────────┐
    │ Send result to  │
    │ API (next turn) │
    └─────────────────┘
```

### Why Does This Matter?

**Different tools are used based on how you request:**

```
# Uses Glob (fast)
> How many tsx files are in the src folder?

# Uses Bash (unnecessarily complex)
> Use find command to count tsx files in src folder
```

For tasks where Claude Code has dedicated tools, requesting those tools is more efficient.

---

## The Subagent System

Complex tasks are split into multiple "subagents."

### Subagent Architecture

```
                          ┌─────────────────┐
                          │   Main Agent    │
                          │ (talks with you)│
                          └────────┬────────┘
                                   │
                    ┌──────────────┼──────────────┐
                    │              │              │
                    ▼              ▼              ▼
         ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
         │   Task 1     │ │   Task 2     │ │   Task 3     │
         │  (explore)   │ │  (analyze)   │ │  (execute)   │
         └──────────────┘ └──────────────┘ └──────────────┘
```

### Subagent Types

| Type | Purpose | Available Tools | Characteristics |
|------|---------|----------------|-----------------|
| `Explore` | Codebase exploration | Read, Glob, Grep | Read-only |
| `Plan` | Planning | Read, Glob, Grep | Read-only |
| `Bash` | Command specialist | Bash only | Git operations etc. |
| `general-purpose` | Complex tasks | All tools | All-purpose |

### Parallel vs Sequential Execution

```
Parallel Execution (independent tasks):
─────────────────────────────────────────────
    ┌──────────┐     ┌──────────┐     ┌──────────┐
    │ Agent A  │     │ Agent B  │     │ Agent C  │
    │ (search1)│     │ (search2)│     │ (search3)│
    └────┬─────┘     └────┬─────┘     └────┬─────┘
         │                │                │
         └────────────────┼────────────────┘
                          │
                          ▼
                   ┌──────────────┐
                   │ Merge Results│
                   └──────────────┘

Sequential Execution (dependent tasks):
─────────────────────────────────────────────
    ┌──────────┐     ┌──────────┐     ┌──────────┐
    │ Agent A  │ ──▶ │ Agent B  │ ──▶ │ Agent C  │
    │ (analyze)│     │ (uses A  │     │ (uses B  │
    │          │     │  result) │     │  result) │
    └──────────┘     └──────────┘     └──────────┘
```

### Why Does This Matter?

**Large tasks are automatically split:**

```
> Analyze this entire project and create a refactoring plan
```

Internally:
1. `Explore` agent analyzes project structure
2. `Plan` agent creates the plan
3. Main agent synthesizes results

**Splitting tasks yourself gives more control:**

```
# All at once (agent splits automatically)
> Analyze project and refactor

# Step by step (more precise control)
> First, just analyze the project structure
> (after reviewing)
> Create a refactoring plan for this part
> (after reviewing plan)
> OK, execute it
```

---

## Model Selection

Claude Code supports multiple models.

| Model | Characteristics | When to Use |
|-------|-----------------|-------------|
| **Opus** | Smartest, expensive | Complex design, hard bugs |
| **Sonnet** | Balanced performance | General tasks (default) |
| **Haiku** | Fast and cheap | Simple tasks, repetitive work |

### Practical Strategy

```
# Planning phase: smart model
> /model opus
> How should I design this system?

# Implementation phase: fast model
> /model sonnet
> Build it according to the plan above
```

Adjust the **cost vs quality tradeoff** based on the situation.

---

## Context Management

### Quality Drops as Conversations Get Long

Claude has limits on how much information it can process at once. As conversations lengthen:
- Earlier content is poorly remembered
- Overall context comprehension blurs
- Response quality degrades

### Solutions

**1. Compress with /compact**
```
> /compact
```
Summarizes the conversation to save tokens.

**2. Separate conversations by topic**
```
# Doing everything in one conversation (contexts mix)
> Make auth feature
> Also modify DB schema
> Also make frontend form

# Separating by topic (more focused)
> /clear
> Let's focus on auth. Make the backend API first.
```

**3. Use CLAUDE.md**

CLAUDE.md is preserved after `/clear`. Put project rules here and context survives even when starting fresh conversations.

---

## Permissions and Security

### Security Policy Flow

```
  User Request
       │
       ▼
┌──────────────┐    No        ┌──────────────┐
│ Dangerous    │ ────────────▶ │ Execute      │
│ operation?   │               │ directly     │
└──────┬───────┘               └──────────────┘
       │ Yes
       ▼
┌──────────────┐    Deny      ┌──────────────┐
│ Request user │ ────────────▶ │ Cancel       │
│ approval     │               │ operation    │
└──────┬───────┘               └──────────────┘
       │ Approve
       ▼
┌──────────────┐
│ Execute in   │
│ sandbox      │
└──────────────┘
```

### Why Does It Ask for Approval?

Claude Code requests approval before potentially dangerous operations:
- File modification/deletion
- Command execution
- External API calls

### Auto-approve Settings

Auto-approve frequently used safe tools:

```json
// settings.json
{
  "permissions": {
    "autoApprove": ["Read", "Glob", "Grep"]
  }
}
```

**Caution**: Be careful with `Edit`, `Write`, `Bash`.

### Sandbox Mode

Bash commands run in a sandbox by default. This protects your system while working.

---

## Practical Tips

### 1. Mention Tools Explicitly

```
# Implicit (Claude must infer)
> How is error handling done in this project?

# Explicit (faster)
> Use grep to search for "catch" keyword and show error handling patterns
```

### 2. One Thing at a Time

```
# Multiple tasks at once (can cause confusion)
> Create file, write tests, and commit

# Step by step (more accurate)
> Create the file first
> (after checking) Write tests
> (after checking) Commit
```

### 3. Verify Before Proceeding

If Claude modified a file, verify the result before moving to the next step. You can immediately fix anything that's wrong.

---

## Summary

What you learned in this chapter:
- [x] Claude Code's overall architecture and API communication flow
- [x] 18 built-in tools system
- [x] How subagents work and parallel execution
- [x] Model selection and context management
- [x] Permissions and security policies

**Key point**: Claude Code isn't magic—it's a system. Understanding the system helps you use it better.

In the next chapter, you'll learn how to customize this system.

Proceed to [Chapter 19: Advanced Configuration](../Chapter19/README.md).
