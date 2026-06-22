# Module 15: Maintaining AI Products & Industry Architecture

This module teaches you how to keep your AI products healthy, cost-effective, and continually improving after launch — AND how real industry teams design, build, and ship AI systems.

## Part 1: Maintaining AI Products (Practicals)

- `module-15-1-monitoring-usage.md` — Monitoring Usage (Observability & Latency)
- `module-15-2-reducing-token-cost.md` — Reducing Token Cost (Optimization & Caching)
- `module-15-3-updating-prompts.md` — Updating Prompts (Version Control & A/B Testing)
- `module-15-4-handling-bugs.md` — Handling Bugs (Guardrails & Hallucinations)
- `module-15-5-user-feedback-cycle.md` — User Feedback Cycle (Thumbs up/down)
- `module-15-6-scaling-strategy.md` — Scaling Strategy (Rate limits & Load balancing)

## Part 2: Industry Architecture Roundtable

A simulated real-world project: **Building an AI-Powered Document Analyzer**. Each file deep-dives into one industry role, with C4 diagrams, real deliverables, and trade-off analysis.

### The Master Blueprint
- `module-15-7-industry-architecture-lifecycle.md` — **Start Here!** Architecture lifecycle, Agile vs Waterfall, DORA metrics, Cloud vs On-Prem, RFC template

### Product, Design & Management Roles
- `module-15-8-role-product-manager.md` — PRD, RICE scoring, OKRs, user journey mapping
- `module-15-9-role-product-owner.md` — User stories, story mapping, INVEST criteria, backlog grooming
- `module-15-10-role-scrum-master.md` — Sprint ceremonies, Agile vs Waterfall decision tree, velocity tracking
- `module-15-11-role-ui-ux-designer.md` — User flows, AI UX patterns, accessibility (WCAG), design handoff
- `module-15-12-role-project-manager.md` — Gantt charts, RACI matrix, risk register, dependency tracking

### Core Engineering Roles
- `module-15-13-role-lead-backend-engineer.md` — C4 Container Diagram, API contracts, Microservices vs Monolith
- `module-15-14-role-lead-frontend-engineer.md` — C4 Component Diagram, state machines, performance budget
- `module-15-15-role-ai-ml-engineer.md` — RAG pipeline, model selection, prompt engineering, evaluation
- `module-15-16-role-machine-learning-engineer.md` — MLOps pipeline, custom vs LLM, drift monitoring
- `module-15-17-role-testing-engineer.md` — Test pyramid, AI testing strategies, golden dataset, performance testing

### Data, Infrastructure & Security Roles
- `module-15-18-role-data-architect.md` — ER diagrams, Medallion Architecture, database selection
- `module-15-19-role-cloud-architect.md` — C4 Deployment Diagram, Cloud vs On-Prem, FinOps, HA/DR
- `module-15-20-role-devops-engineer.md` — CI/CD pipeline, Terraform, monitoring, DORA dashboard
- `module-15-21-role-security-engineer.md` — STRIDE threat model, OWASP Top 10, prompt injection defense
- `module-15-22-role-risk-officer.md` — Compliance matrix, GDPR, vendor risk, AI governance

### Recommended Order

1. Start with **15.7** (Architecture Lifecycle) — understand the big picture
2. Read the role that matches your interest
3. Create the **deliverable** at the end of each role file
4. Your deliverables connect: PM's PRD → PO's Stories → SM's Sprint Plan → Engineers build → QA tests → DevOps deploys → Security audits → Risk approves

### Prerequisites

- A deployed AI application
- Visual Studio Code installed
- Basic understanding of API requests

### 🚀 Why Learn Industry Architecture?

- ✅ **Confidence**: Walk into any architecture meeting and contribute meaningfully
- ✅ **Career Growth**: Understanding cross-functional dynamics accelerates promotions
- ✅ **Real Projects**: Each role file ends with a deliverable you can add to your portfolio
- ✅ **Industry Readiness**: Learn C4 diagrams, DORA metrics, STRIDE, Medallion Architecture — what companies actually use

### Tech Stack

- **Editor**: Visual Studio Code
- **Observability**: Langfuse / Helicone (or similar platforms)
- **Architecture**: C4 Model, Mermaid diagrams, STRIDE, DORA
- **Methodology**: Agile (Scrum), Waterfall, SAFe
