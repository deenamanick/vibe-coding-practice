## Practical 5: User Feedback Cycle

### Why This Matters

Observability tools (Practical 1) tell you *what* happened technically — latency, token counts, error rates. But they cannot tell you *whether the AI was actually helpful*. Only users know that.

A structured feedback cycle creates a **quality improvement flywheel**:

1. Users signal bad responses via 👍/👎
2. You identify which prompt version caused the issue
3. You fix the prompt and run regression tests (Practical 3)
4. You re-deploy and measure if the rating improves

Without this loop, you are optimising blindly. With it, every user interaction teaches you how to make the product better.

### Core Concepts

| Concept | What it is | Why it matters |
| :--- | :--- | :--- |
| **Explicit feedback** | 👍/👎 + optional reason | Directly actionable, high signal |
| **Implicit feedback** | Regenerate clicks, session abandonment | Passive signal — user didn't like the answer |
| **Feedback attribution** | Tying a rating to a specific `promptVersion` and `traceId` | Lets you correlate ratings with prompt changes |
| **Quality score** | Aggregated positive rate per metric (prompt, model, topic) | Enables trend analysis and A/B result measurement |

### What you'll build

You will implement a **full feedback pipeline** in Visual Studio Code: a frontend feedback component, a backend API that stores ratings in a database, a nightly aggregation query, and a prompt quality report linked to your trace IDs from Practical 1.

---

### Step 1: Set up your database schema

Create a D1 migration or SQLite migration file `migrations/add_ai_feedback.sql`:

```sql
CREATE TABLE IF NOT EXISTS ai_feedback (
  id           TEXT PRIMARY KEY,
  trace_id     TEXT NOT NULL,          -- Links to your Langfuse trace
  session_id   TEXT NOT NULL,
  user_id      TEXT,
  prompt_name  TEXT NOT NULL,          -- e.g., "product-assistant"
  prompt_version INTEGER NOT NULL,     -- e.g., 2
  model        TEXT NOT NULL,
  rating       INTEGER NOT NULL CHECK (rating IN (-1, 1)),  -- -1 = thumbs down, 1 = up
  reason       TEXT,                   -- Optional: "Too long", "Inaccurate", "Off-topic"
  user_message TEXT NOT NULL,
  ai_response  TEXT NOT NULL,
  created_at   TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_feedback_prompt ON ai_feedback (prompt_name, prompt_version);
CREATE INDEX idx_feedback_rating ON ai_feedback (rating, created_at);
```

---

### Step 2: Create the backend feedback API

In your Hono or Express backend, add `src/routes/feedback.ts`:

```typescript
import { Hono } from "hono";
import { z } from "zod";

const FeedbackSchema = z.object({
  traceId:       z.string().min(1),
  sessionId:     z.string().min(1),
  promptName:    z.string().min(1),
  promptVersion: z.number().int().positive(),
  model:         z.string().min(1),
  rating:        z.union([z.literal(1), z.literal(-1)]),
  reason:        z.string().optional(),
  userMessage:   z.string().min(1),
  aiResponse:    z.string().min(1),
});

export const feedbackRouter = new Hono<{ Bindings: { DB: D1Database } }>();

feedbackRouter.post("/", async (c) => {
  const body = await c.req.json();
  const parsed = FeedbackSchema.safeParse(body);

  if (!parsed.success) {
    return c.json({ error: parsed.error.flatten() }, 400);
  }

  const {
    traceId, sessionId, promptName, promptVersion,
    model, rating, reason, userMessage, aiResponse
  } = parsed.data;

  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  await c.env.DB.prepare(`
    INSERT INTO ai_feedback
      (id, trace_id, session_id, user_id, prompt_name, prompt_version,
       model, rating, reason, user_message, ai_response, created_at)
    VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12)
  `).bind(
    id, traceId, sessionId, null, promptName, promptVersion,
    model, rating, reason ?? null, userMessage, aiResponse, now
  ).run();

  return c.json({ ok: true, id });
});

// Aggregate quality score per prompt version
feedbackRouter.get("/report", async (c) => {
  const rows = await c.env.DB.prepare(`
    SELECT
      prompt_name,
      prompt_version,
      model,
      COUNT(*) AS total,
      SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) AS positive,
      ROUND(100.0 * SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) / COUNT(*), 1) AS positive_rate,
      COUNT(reason) AS flagged_with_reason
    FROM ai_feedback
    WHERE created_at >= datetime('now', '-30 days')
    GROUP BY prompt_name, prompt_version, model
    ORDER BY prompt_name, prompt_version DESC
  `).all();

  return c.json(rows.results);
});
```

---

### Step 3: Build the frontend feedback component

Create `src/components/AIMessage.tsx` (React + TypeScript):

```tsx
import { useState } from "react";

interface Props {
  traceId: string;
  sessionId: string;
  promptName: string;
  promptVersion: number;
  model: string;
  userMessage: string;
  aiResponse: string;
}

type FeedbackState = "idle" | "rated" | "submitting";

const REASON_OPTIONS = ["Too long", "Too short", "Inaccurate", "Off-topic", "Not helpful"];

export function AIMessage({
  traceId, sessionId, promptName, promptVersion, model, userMessage, aiResponse
}: Props) {
  const [feedbackState, setFeedbackState] = useState<FeedbackState>("idle");
  const [pendingRating, setPendingRating] = useState<1 | -1 | null>(null);
  const [reason, setReason] = useState<string>("");

  const submitFeedback = async (rating: 1 | -1, selectedReason?: string) => {
    setFeedbackState("submitting");

    await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        traceId, sessionId, promptName, promptVersion, model,
        rating,
        reason: selectedReason ?? undefined,
        userMessage,
        aiResponse,
      }),
    });

    setFeedbackState("rated");
  };

  const handleThumbsDown = (rating: -1) => {
    setPendingRating(rating);
    // Show reason selector before submitting
  };

  return (
    <div className="ai-message">
      <p className="response-text">{aiResponse}</p>

      {feedbackState === "idle" && (
        <div className="feedback-row">
          <button onClick={() => submitFeedback(1)} title="Helpful">👍</button>
          <button onClick={() => handleThumbsDown(-1)} title="Not helpful">👎</button>
        </div>
      )}

      {/* Reason selector appears after thumbs down */}
      {feedbackState === "idle" && pendingRating === -1 && (
        <div className="reason-selector">
          <p>What went wrong?</p>
          <div className="reason-chips">
            {REASON_OPTIONS.map(opt => (
              <button
                key={opt}
                className={reason === opt ? "selected" : ""}
                onClick={() => setReason(opt)}
              >
                {opt}
              </button>
            ))}
          </div>
          <button
            className="submit-btn"
            disabled={!reason}
            onClick={() => submitFeedback(-1, reason)}
          >
            Submit Feedback
          </button>
        </div>
      )}

      {feedbackState === "submitting" && <p className="muted">Saving...</p>}
      {feedbackState === "rated" && <p className="muted">Thanks for your feedback!</p>}
    </div>
  );
}
```

---

### Step 4: Analyse your feedback data

Run this query in VS Code's D1 SQL console or database client to find the worst-performing prompts:

```sql
-- Find the top 10 most-downvoted queries in the last 7 days
SELECT
  user_message,
  ai_response,
  reason,
  prompt_version,
  COUNT(*) AS negative_count
FROM ai_feedback
WHERE rating = -1
  AND created_at >= datetime('now', '-7 days')
GROUP BY user_message, reason
ORDER BY negative_count DESC
LIMIT 10;
```

---

### ✅ Success Checklist

- [ ] Every AI response displayed to users has a 👍/👎 component attached.
- [ ] Negative feedback captures a structured reason, not just a click.
- [ ] Each feedback record links to a `trace_id` (from Practical 1) so you can replay the full conversation.
- [ ] You can run the quality report query and see positive rate broken down per prompt version.
- [ ] You have a weekly schedule to review the top 10 downvoted queries and update your prompts accordingly.

### 🆘 Common Problems

**Problem**: "Our positive feedback rate is 90%+ but users still seem unhappy."
- **Fix**: Most users don't bother clicking 👎 — they just leave. Your 90% is survivor bias from engaged users. Track implicit signals too: if a user regenerates the response or immediately rephrases their question, treat that as a soft negative signal.

**Problem**: "I have thousands of negative feedbacks — where do I even start?"
- **Fix**: Cluster them by `reason` first, then by `prompt_name`. Address the most frequent reason for the highest-traffic prompt. One prompt fix can resolve hundreds of complaints at once.

---

## 🎨 Lovable AI Prompt (copy/paste this)

```text
Build a "Prompt Quality Analytics" admin UI.

Requirements:
- A header showing the overall positive feedback rate with a large gauge chart (e.g., 78% positive).
- A "Version Comparison" table: rows = prompt versions, columns = Total Ratings, 👍 Rate (%), 👎 Rate (%), Most Common Failure Reason.
- A "Failure Reason Breakdown" section: a horizontal bar chart showing the distribution of thumbs-down reasons (Inaccurate, Too long, Off-topic, etc.).
- A "Worst Queries" table listing the top 10 most frequently downvoted inputs, with the AI response, the failure reason, and a "Copy Query" button to paste it into a prompt testing tool.
- A trend line chart showing the 👍 rate over the last 30 days, with vertical lines marking each prompt version deployment date.
```
