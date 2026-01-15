# Chapter 23: CI/CD Automation

**English** | [한국어](./README.ko.md)

## What You Will Learn

- CI/CD concepts and why they matter
- Building automation with GitHub Actions
- Integrating Claude Code into pipelines

---

## Why Learn CI/CD?

Manual work causes mistakes and wasted time:

```
Manual:
1. Modify code
2. Run tests (forgot)
3. Build (error occurs)
4. Fix again
5. Deploy (missing config)
...

Automated:
1. Modify code
2. Everything else is automatic!
```

---

## What is CI/CD?

### Basic Concept

```
┌─────────────────────────────────────────────────────────────────┐
│                        CI/CD Pipeline                            │
└─────────────────────────────────────────────────────────────────┘

     Code Push
         │
         ▼
┌──────────────┐
│     CI       │  ← Continuous Integration
│  (Auto Test) │
└──────┬───────┘
       │ Pass
       ▼
┌──────────────┐
│    Build     │
│              │
└──────┬───────┘
       │ Success
       ▼
┌──────────────┐
│     CD       │  ← Continuous Deployment
│ (Auto Deploy)│
└──────────────┘
```

- **CI**: Auto-test on code changes
- **CD**: Auto-deploy when tests pass

---

## GitHub Actions Basics

### Workflow File Location

```
.github/
└── workflows/
    ├── ci.yml        # CI workflow
    ├── deploy.yml    # Deploy workflow
    └── review.yml    # Code review workflow
```

### Basic Structure

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

## Practical Workflow Examples

### 1. Basic CI Pipeline

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

### 2. Auto Deployment

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

### 3. PR Review Automation

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
            Review this PR for:
            - Potential bugs
            - Security vulnerabilities
            - Code quality
```

---

## Using Claude Code in CI

### Headless Mode

Run Claude in scripts with the `-p` flag:

```bash
# Basic usage
claude -p "Summarize this project"

# Allow specific tools only
claude -p "Analyze code" --allowedTools "Read,Glob,Grep"

# JSON output
claude -p "Extract function list" --output-format json
```

### Code Review in CI

```yaml
- name: Claude Code Review
  run: |
    # Get changed files
    CHANGED_FILES=$(git diff --name-only HEAD~1)

    # Review with Claude
    claude -p "Review these files: $CHANGED_FILES" \
      --allowedTools "Read,Glob,Grep"
```

### Auto Documentation

```yaml
- name: Generate Docs
  run: |
    claude -p "Generate documentation for functions in src/" \
      --allowedTools "Read,Write,Glob"

    git add docs/
    git commit -m "docs: auto-generated documentation"
    git push
```

---

## Building Production Pipelines

### Complete CI/CD Example

```yaml
name: Full Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  # 1. Code Quality Check
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

  # 2. Testing
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm test -- --coverage

  # 3. Build
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

  # 4. Deploy (main branch only)
  deploy:
    if: github.ref == 'refs/heads/main'
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/download-artifact@v4
        with:
          name: build
      - run: vercel --prod --token=${{ secrets.VERCEL_TOKEN }}

  # 5. Notification
  notify:
    needs: deploy
    runs-on: ubuntu-latest
    steps:
      - name: Slack Notification
        run: |
          curl -X POST ${{ secrets.SLACK_WEBHOOK }} \
            -H 'Content-type: application/json' \
            -d '{"text": "Deployment complete!"}'
```

---

## Security Management

### Secrets Setup

Set in GitHub Settings → Secrets and variables → Actions:

- `ANTHROPIC_API_KEY`: Claude API key
- `VERCEL_TOKEN`: Vercel deploy token
- `SLACK_WEBHOOK`: Slack notification URL

### Permission Restrictions

```yaml
- name: Read-only Claude
  run: |
    claude -p "Analyze code" \
      --allowedTools "Read,Glob,Grep"  # Exclude write tools
```

---

## Cost Optimization

### Process Only Changed Files

```yaml
- name: Get changed files
  id: changed
  run: |
    echo "files=$(git diff --name-only HEAD~1)" >> $GITHUB_OUTPUT

- name: Review only changed
  run: |
    claude -p "Review only these files: ${{ steps.changed.outputs.files }}"
```

### Use Caching

```yaml
- name: Cache dependencies
  uses: actions/cache@v4
  with:
    path: node_modules
    key: npm-${{ hashFiles('package-lock.json') }}
```

---

## Summary

What you learned in this chapter:
- [x] CI/CD concepts (auto-test, auto-deploy)
- [x] GitHub Actions basic structure
- [x] Practical workflow examples
- [x] Claude Code CI integration
- [x] Security and cost optimization

**Key point**: Automation provides value continuously once set up.

In the next chapter, you'll learn how to effectively use Claude Code in teams.

Proceed to [Chapter 24: Team Collaboration](../Chapter24/README.md).
