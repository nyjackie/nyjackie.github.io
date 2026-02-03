---
slug: building-multi-agent-ai-systems
title: How I Built a Multi-Agent AI System (And Why You Should Too)
authors: [jackie]
tags: [ai, architecture, llm, multi-agent, system-design]
---

So you want to build a multi-agent AI system? Nice. Let me tell you how I built one inspired by Steins;Gate characters, and why this architecture is actually pretty based.

<!--truncate-->

## The Problem: One AI to Rule Them All (Doesn't Work)

Here's the thing—asking one AI to do everything is like asking one person to be a master chef, mechanic, doctor, and lawyer at the same time. Sure, they might know a little about each, but would you trust them to fix your car's transmission? Hell no.

Single LLMs have the same problem. You ask them about React performance, then Docker configs, then color theory, and the responses get... generic. Mediocre. The AI equivalent of "have you tried turning it off and on again?"

Multi-agent systems fix this by doing what any good RPG party does: **specialization**.

- **Specialization**: Each agent is a domain expert
- **Parallel Processing**: Multiple agents work simultaneously (like a raid party)
- **Context Isolation**: Agents don't get confused by irrelevant info
- **Scalability**: Add new specialists without breaking existing ones

## The Architecture: Diverging Worldlines

Think of it like this—in Steins;Gate, different worldlines exist simultaneously. In multi-agent systems, different agents exist simultaneously, each handling their own domain.

```
User Query
    ↓
Future Gadget Lab Agent (Orchestrator)
  ├─ Okabe: Analyzes & delegates
  ├─ Kurisu: Provides technical solutions
  ├─ Daru: Handles DevOps/tooling
  └─ Mayuri: Ensures UX/accessibility
    ↓
  Subagent Delegation (when needed)
    ↓
┌─────────┬─────────┬─────────┬─────────┐
│ Kurisu  │  Daru   │ Mayuri  │  Okabe  │
│Subagent │Subagent │Subagent │Subagent │
│ (Code)  │(DevOps) │  (UX)   │ (Arch)  │
└─────────┴─────────┴─────────┴─────────┘
    ↓
Response (in character)
    ↓
User
```

### The Core Components

**FGL Lab Agent (Main Orchestrator)**
- The primary agent you interact with
- Contains all Lab Member personas (Okabe, Kurisu, Daru, Mayuri)
- Analyzes questions and decides if subagent delegation is needed
- Presents responses in character format

**Specialized Subagents** (Invoked when needed)
- **Kurisu Subagent**: Deep code analysis, complex algorithms, refactoring
- **Daru Subagent**: DevOps configurations, Docker, AWS, security
- **Mayuri Subagent**: Accessibility audits, design systems, WCAG compliance
- **Okabe Subagent**: Architecture decisions, system design, feature planning

**Delegation Protocol**
- FGL agent handles most questions directly
- Complex domain-specific questions trigger subagent invocation
- Subagents have specialized tools and deeper expertise
- Responses are aggregated and presented in character

## Implementation: Let's Build This Thing with Kiro

### Setting Up Kiro CLI

First, get Kiro installed:

```bash
# Install Kiro CLI (macOS/Linux)
curl -fsSL https://cli.kiro.dev/install | bash

# Verify it's working
kiro-cli --version
```

### Kiro Agent Structure

Kiro agents live in `~/.kiro/agents/`. Each agent has:
- A `.json` config file (defines name, tools, model)
- A `.md` prompt file (the system prompt)

```
~/.kiro/agents/
├── FGL.json           # Main orchestrator config
├── fgl_prompt.md      # FGL system prompt
├── Kurisu.json        # Code specialist config
├── kurisu.md          # Kurisu system prompt
├── Daru.json          # DevOps specialist config
├── daru.md            # Daru system prompt
├── Mayuri.json        # UX specialist config
└── mayuri.md          # Mayuri system prompt
```

### Creating the Main Orchestrator

**FGL.json** (Main agent config):

```json
{
  "name": "FGL",
  "description": "Future Gadget Laboratory - Multi-agent orchestrator",
  "prompt": "file:///Users/yourname/.kiro/agents/fgl_prompt.md",
  "mcpServers": {},
  "tools": [
    "read",
    "write",
    "shell",
    "grep",
    "glob",
    "knowledge",
    "thinking",
    "delegate",
    "fs_read",
    "subagent",
    "@sequential-thinking",
    "@fetch",
    "@memory",
    "@context7"
  ],
  "toolsSettings": {
    "subagent": {
      "allowedAgents": ["Daru", "Okabe", "Kurisu", "Mayuri"]
    }
  },
  "model": "claude-sonnet-4-20250514",
  "includeMcpJson": true
}
```

Key fields:
- `prompt`: Points to your system prompt file (use `file://` prefix)
- `tools`: What tools this agent can use
- `toolsSettings.subagent.allowedAgents`: Which subagents can be invoked
- `mcpServers`: MCP server configurations (empty object if none)
- `includeMcpJson`: Whether to include global MCP settings

### Creating Specialist Subagents

**Kurisu.json** (Code specialist):

```json
{
  "name": "Kurisu",
  "description": "Makise Kurisu - Logic Specialist for code review, debugging, and TypeScript",
  "prompt": "file:///Users/yourname/.kiro/agents/kurisu.md",
  "mcpServers": {},
  "tools": ["read", "write", "shell", "grep", "glob", "thinking", "@github", "@sequential-thinking"],
  "model": null,
  "includeMcpJson": true
}
```

**Daru.json** (DevOps specialist):

```json
{
  "name": "Daru",
  "description": "Super Hacker Daru - DevOps, security, Docker, and AWS specialist",
  "prompt": "file:///Users/yourname/.kiro/agents/daru.md",
  "mcpServers": {},
  "tools": ["shell", "aws", "grep", "glob", "read", "write", "@github", "@fetch"],
  "model": null,
  "includeMcpJson": true
}
```

Setting `model: null` means subagents inherit the model from the parent agent.

### System Prompts

**fgl_prompt.md** (Orchestrator prompt):

```markdown
You are the Future Gadget Laboratory, a multi-agent AI system.

## SUBAGENT DELEGATION

Use the `use_subagent` tool for complex domain-specific questions:

**ROUTING RULES:**
- Code/TypeScript/React → Invoke `Kurisu` subagent
- DevOps/Docker/AWS → Invoke `Daru` subagent  
- UX/Accessibility → Invoke `Mayuri` subagent
- Architecture/Design → Invoke `Okabe` subagent

## RESPONSE FORMAT
Present responses with Lab Member dialogue:
- 🔬 Okabe - Architecture & delegation
- ✨ Kurisu - Code & technical solutions
- ⌨️ Daru - DevOps & tooling
- 🌸 Mayuri - UX & accessibility
```

**kurisu.md** (Specialist prompt):

```markdown
You are Kurisu Makise, code specialist of the Future Gadget Lab.

## EXPERTISE
- TypeScript with strict types
- React performance optimization
- Algorithm analysis
- Debugging and code review

## PERSONALITY
- Tsundere genius, evidence-based
- "It's not like I wanted to help you..."

Provide production-grade code with strict types and proper error handling.
```

### Subagent Invocation

The FGL agent uses `use_subagent` to delegate:

```json
{
  "command": "InvokeSubagents",
  "content": {
    "subagents": [
      {
        "agent_name": "Kurisu",
        "query": "Optimize this React component",
        "relevant_context": "Component code here..."
      }
    ]
  }
}
```

For parallel execution, include multiple subagents:

```json
{
  "command": "InvokeSubagents",
  "content": {
    "subagents": [
      {
        "agent_name": "Kurisu",
        "query": "Review React performance"
      },
      {
        "agent_name": "Daru",
        "query": "Review Docker configuration"
      }
    ]
  }
}
```

### Running Your Multi-Agent System

```bash
# List available agents
kiro-cli agent list

# Start chat with the FGL orchestrator
kiro-cli chat --agent FGL

# Or use the shorthand
kiro-cli --agent FGL

# The agent will delegate to subagents automatically
# based on your question type
```

## Design Decisions: Avoiding Temporal Paradoxes

### Parallel vs Sequential: When to Time Leap

**Use Parallel When:**
- Tasks are independent (code review + DevOps check)
- You need multiple perspectives on the same problem
- Speed matters more than order

**Use Sequential When:**
- Output of Agent A feeds into Agent B
- You need a decision before implementation
- There's a logical dependency chain

Think of parallel as exploring multiple worldlines at once. Sequential is following one timeline step by step.

### Context Management: Don't Overload the Reading Steiner

Each agent should get:
- **The user's actual question** (obviously)
- **Relevant context** (files, previous responses, system state)
- **Constraints** (budget, time limits, style preferences)

What NOT to pass:
- Your entire git history
- Unrelated conversation threads
- Every file in your codebase

Agents with bloated context perform worse. Keep it focused.

### Response Aggregation: Reaching Steins Gate

How do you combine multiple agent responses?

- **Concatenation**: Just stick them together (simple, works)
- **Synthesis**: Have a meta-agent combine them (cleaner)
- **Ranked Selection**: Pick the best one (risky)
- **Structured Merge**: Combine by section (most work, best results)

I use concatenation with clear formatting. Each agent's response is labeled, so you know who said what.

## Real Example: The Future Gadget Lab System

The system you're talking to right now? It's a multi-agent system based on Steins;Gate characters, running on AWS's Kiro CLI.

### The Architecture

**Future Gadget Lab (Main Agent)**
- Primary orchestrator with all Lab Member personas
- Handles most questions directly with character dialogue
- Decides when to delegate to specialized subagents
- Presents all responses in Steins;Gate character format

**Specialized Subagents** (Invoked for complex tasks)
- **Kurisu**: Deep TypeScript/React analysis, algorithm optimization, complex debugging
- **Daru**: Docker configs, AWS infrastructure, CI/CD pipelines, security audits
- **Mayuri**: WCAG compliance checks, accessibility testing, design system reviews
- **Okabe**: System architecture decisions, state management design, feature planning

### How It Works in Practice

When you ask a simple question like "How do I center a div?", the FGL agent responds directly—Kurisu gives you the CSS, maybe Okabe makes a dramatic comment, done.

When you ask something complex like "Review my Docker setup and optimize my React performance", the FGL agent:
1. Recognizes this needs deep expertise
2. Invokes Daru subagent (Docker) and Kurisu subagent (React) in parallel
3. Receives their specialized analysis
4. Presents the combined solution in character format

The character personas are the presentation layer—underneath, it's clean delegation logic.

## Mistakes I Made (So You Don't Have To)

**Over-routing Everything**
Don't invoke agents for "hello" or "thanks". Simple queries should get simple answers. Save the multi-agent orchestration for actual complex questions.

**Context Explosion**
I initially passed entire file trees to agents. Bad idea. They got confused and slow. Now I only pass relevant files. Way better.

**Agents Contradicting Each Other**
Without proper aggregation, agents can give conflicting advice. Have a synthesis layer or clear priority rules.

**Giving Every Agent Every Tool**
Don't give the UX agent access to `shell`. Define clear tool boundaries based on what each agent actually needs.

## Performance: The Divergence Meter

Some real talk about performance:

- **Latency**: Parallel execution is faster overall, but you're hitting multiple LLM endpoints at once. Make sure your rate limits can handle it.
- **Cost**: Multiple agents = multiple API calls = more money. Route intelligently. Don't invoke 4 agents when 1 will do.
- **Token Usage**: Specialized prompts actually use FEWER tokens than monolithic ones. Each agent has focused context.
- **Caching**: Cache agent responses for similar queries. No need to re-invoke for identical questions.

## When NOT to Build This

Multi-agent systems are cool, but they're not always the answer:

- Simple CRUD apps (overkill)
- Single-domain problems (just use one agent)
- Tight latency requirements (under 500ms response time)
- Limited API budget (multiple calls add up)
- MVP/prototype stage (keep it simple first)

Start simple. Add complexity when you actually need it.

## What's Next: Future Worldlines

Some ideas for where this architecture can go:

- **Agent Learning**: Agents improve based on user feedback and past interactions
- **Dynamic Routing**: Use ML to classify queries instead of keyword matching
- **Agent Collaboration**: Let agents talk to each other directly (gets complex fast)
- **Hierarchical Systems**: Agents that manage sub-agents (inception vibes)

## Final Thoughts

Multi-agent systems aren't just a meme architecture—they genuinely work better than monolithic AI for complex domains. You get specialized expertise, cleaner context, and more maintainable systems.

The key is thoughtful design:
- Route intelligently (don't over-complicate)
- Pass minimal context (focused is better)
- Use parallel execution when it makes sense
- Start simple, scale when needed

The future of AI isn't one god-tier model that does everything. It's specialized agents working together, each doing what they do best.

Kind of like a good dev team, honestly.

---

**Resources Worth Checking Out:**
- [Kiro CLI Documentation](https://kiro.dev/docs/cli/custom-agents/)
- [LangChain Multi-Agent Docs](https://python.langchain.com/docs/modules/agents/)
- [AutoGen Framework](https://microsoft.github.io/autogen/)
- [CrewAI](https://github.com/joaomdmoura/crewAI)

Now go build something cool. El Psy Kongroo.
