# Chapter 25: Mastery

**English** | [한국어](./README.ko.md)

## Congratulations!

You've completed all 25 chapters.

Now you can use Claude Code to create various projects.

---

## Summary of What You Learned

### Part 1: Getting Started (Chapter 01-05)

- AI coding and vibecoding concepts
- Claude Code installation and first conversation
- Reading and writing files
- Terminal commands

### Part 2: Core Features (Chapter 06-10)

- Effective prompting
- Code exploration (Glob, Grep)
- Code editing
- Git basics
- Project memory (CLAUDE.md)

### Part 3: Practice I (Chapter 11-14)

- Website development
- Deployment (Vercel)
- Data storage
- Mini game creation

### Part 4: Practice II (Chapter 15-17)

- Building CLI tools
- Creating chatbots
- Full-stack app development

### Part 5: Advanced (Chapter 18-25)

- Architecture understanding
- Advanced configuration
- Hooks & Commands
- Agents & Skills
- MCP integration
- CI/CD automation
- Team collaboration
- Mastery (now!)

---

## Core Principles Review

### 1. Be Specific

```
# Bad example
> Fix the bug

# Good example
> There's a bug in @src/login.js where email validation doesn't work.
> Invalid emails like "test@" pass through.
> Fix it to check if the domain has a dot (.).
```

### 2. Work Step by Step

```
# Step 1: Understand
> Explain this project structure

# Step 2: Plan
> How should I build the login feature? Don't write code yet.

# Step 3: Execute
> Great, build it according to that plan

# Step 4: Verify
> Test it
```

### 3. Improve with Feedback

First results don't have to be perfect.

```
> The button is too small. Make it bigger.
> The color is bad. Change it to blue.
> Add a hover effect.
```

### 4. Utilize Configuration

- **CLAUDE.md**: Project rules
- **Commands**: Frequently used prompts
- **Agents**: Specialized roles
- **Hooks**: Automation triggers

### 5. Stay Safe with Git

Always commit before major changes:

```
> Commit the current state. Backup before refactoring.
```

---

## Common Workflows

### Starting a New Project

```
1. > Create the project folder
2. > Initialize npm/git
3. > Create CLAUDE.md
4. > Create basic file structure
```

### Bug Fixing

```
1. > Why am I getting this error? [error message]
2. > Find the cause
3. > Fix it
4. > Test it
```

### Adding New Features

```
1. > How should I build this feature?
2. > Build it according to that plan
3. > Add tests
4. > Commit it
```

### Creating a PR

```
1. > /pr
```

---

## Advanced Feature Usage

### Automation with Hooks

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

### Extension with MCP

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

### Auto Deployment with CI/CD

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

## Next Steps

### If You Want to Learn More

1. **Official Documentation**: [docs.anthropic.com](https://docs.anthropic.com)
2. **Example Projects**: Search for Claude Code examples on GitHub
3. **Community**: Learn from how others use it

### Projects to Challenge

- [ ] Build a personal blog
- [ ] To-do app (Full-stack)
- [ ] Real-time chat app
- [ ] AI chatbot service
- [ ] Automation dashboard
- [ ] Team Claude Code configuration

---

## Final Practice: Comprehensive Project

Use everything you've learned to complete one project.

### Recommended Project: Personal Dashboard

```
> Create a personal dashboard.
> - To-do list
> - Random quotes (API)
> - Recent GitHub activity (API)
> - Notepad
>
> Store data with localStorage
> Deploy with Vercel
> Write CLAUDE.md well
> Version control with Git
```

### Project Checklist

- [ ] Planning: Define features
- [ ] Development: Implement one by one
- [ ] Testing: Verify it works
- [ ] Deployment: Publish to the internet
- [ ] Sharing: Show it to others

---

## Thank You

Congratulations on completing this curriculum.

With Claude Code, you can turn any idea into reality.

**Remember:**
- You don't need to be perfect from the start
- Keep improving with feedback
- Claude is always ready to help

---

## Appendix: Useful Links

### Official Resources

- [Anthropic Documentation](https://docs.anthropic.com)
- [Anthropic Blog](https://www.anthropic.com/blog)
- [Claude Code GitHub](https://github.com/anthropics/claude-code)

### Reference Materials

- [MDN Web Docs](https://developer.mozilla.org/) - Web development
- [JavaScript.info](https://javascript.info/) - JavaScript tutorial
- [React Official Docs](https://react.dev/) - React

### Tools

- [Vercel](https://vercel.com) - Deployment
- [GitHub](https://github.com) - Code repository
- [GitHub Actions](https://github.com/features/actions) - CI/CD

---

**The End. Now go out and build amazing things!**
