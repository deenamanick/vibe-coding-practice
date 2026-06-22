# AGENTS.md

## Repository
- **Name**: Jeevisoft
- **Architecture Type**: Decoupled Monorepo + Speed Layer (See `jeevisoft-architecture` skill)
- **Frontend**: Cloudflare Pages (React 18, Vite, Tailwind CSS, shadcn/ui)
- **Backend**: Cloudflare Workers (Standalone API)
- **Database**: Cloudflare D1 (SQLite)
- **Object Storage**: Cloudflare R2

## Architecture & Navigation
- **Frontend Source (`/frontend` or `/src`)**: Purely static SPA. All routing is handled by React Router. API calls must point to the Backend Worker URL.
- **Backend Source (`/worker`)**: The standalone API router (e.g., using Hono or native `@cloudflare/workers-types`). 
- **Database Migrations (`/migrations`)**: D1 schema and data changes. 

## AI Development Governance (CRITICAL)
- **Mandatory AI Review**: All AI-generated code MUST pass the Jeevi AI Reviewer before production. Production AI enforcement is mandatory; PR AI review is advisory only.
- **Blocking Criteria**: Critical findings (Security + HIGH confidence) block deployment.
- **Fail-Open Policy**: AI failures must fail-open (never block the dev workflow).
- **Custom Rules & Skip Mechanism**: 
  - Repo-specific rules must be defined via `.jeevi-rules.json`. If this file exists, its rules **override** this global AGENTS.md.
  - To completely exclude a repository from global AGENTS.md automated updates, create an empty `.jeevi-ignore` file in its root.

## Async Processing Standard
- **HTTP 202 Pattern**: All heavy operations MUST be async (polling or queue-based). APIs must return HTTP 202 immediately for long-running tasks.
- **Client Polling**: Clients must use polling or event-driven updates.
- **State Management**: Background jobs must store state in D1.
- **Resilience**: All jobs must support retry + timeout handling.

## Data Architecture & Scaling Thresholds (CRITICAL)
- **Default to D1 Monolith**: Always start by using D1 as both the operational database and the analytics engine. 
- **When to introduce the Analytics Plane (R2 Data Catalog / Iceberg / Pipelines)**: Only introduce this complex decoupled architecture when you hit these thresholds:
  1. **D1 Cost Walls**: Dashboard aggregation queries (`SUM`, `COUNT`) are burning through D1 "Rows Read" billing limits.
  2. **Infinite Retention**: The system requires storing massive historical fact data indefinitely without bloating D1.
  3. **Ingestion Bottlenecks**: The system must ingest massive CSVs asynchronously without locking D1 tables.
  4. **OLAP Timeouts**: Dashboard load times exceed 5 seconds due to heavy analytical math failing in SQLite.
- **The Hybrid Engine**: When you migrate to the Analytics Plane, design a Hybrid Precompute Worker. The Worker should query R2 SQL first, but instantly fall back to D1 if the pipeline data hasn't compacted yet, storing the final JSON in KV for the UI.

## Universal Security & Observability (CRITICAL)
- **Strict API Authorization (Anti-IDOR/BOLA)**: Every backend API endpoint MUST explicitly verify that the requesting user owns or has explicit permission to access the specific resource ID. Never trust the client's requested ID.
- **Zero-Knowledge Encryption**: Highly sensitive user data must be encrypted client-side using the native Web Crypto API *before* being sent to the backend.
- **Rate Limiting**: Every public API must implement rate limiting. Use KV or D1 for rate tracking. Auth endpoints must have strict limits. Return HTTP 429 with a `Retry-After` header when limits are exceeded.
- **Observability & Logging**: All backend errors must be logged with context using structured logs (JSON). **Never expose internal errors to the client.** Track critical metrics: request latency, error rate, and AI review outcomes. Dashboards must reflect system health.

## Cloudflare Service Rules (CRITICAL)
- **Workers Background Tasks**: 
  - Use **Cloudflare Workflows** for multi-step workflows, long-running processes (>30s), and retry-critical jobs.
  - Use `context.waitUntil()` for bounded AI inference (retry-safe) and lightweight asynchronous processing.
- **D1 Database Optimization (Rows Read priority)**: 
  - **Covering Indexes:** Always create indexes containing *all* columns requested by a `SELECT` or `WHERE` clause to prevent expensive B-Tree lookups.
  - **Partial/Functional Indexes:** Use Partial Indexes for targeted data (`WHERE active = 1`) and Functional Indexes when queries rely heavily on transformations like `LOWER(name)`.
  - **CTE Refactoring:** Always push `WHERE` filters directly *inside* Common Table Expressions (CTEs) before `GROUP BY` clauses.
  - **KV Caching:** Never run massive `COUNT` or `SUM` operations synchronously on UI dashboard load. Offload heavy aggregations to background Cron Triggers and cache the JSON result in **Cloudflare KV**.
- **R2 Storage Lifecycle**: 
  - Implement soft-delete before permanent deletion.
  - Schedule cleanup jobs for orphaned files.
  - Track file ownership explicitly.
  - Never load large R2 files entirely into memory; always stream data using `ReadableStream`.

## General Coding Boundaries
- **Strict Decoupling**: **DO NOT** use Cloudflare Pages Functions (`/functions/`) inside the frontend directory. The backend must remain a fully standalone Worker.
- **Workers Environment**: The backend runs on the V8 isolate runtime. **DO NOT** use Node.js built-ins (`fs`, `path`, `child_process`).
- **Deployments**: All production deployments must pass the CI pipeline, AI Reviewer enforcement, and security scans. Direct pushes to `main` are strictly prohibited.
