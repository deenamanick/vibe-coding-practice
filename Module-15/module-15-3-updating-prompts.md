## Practical 3: Updating Prompts

### Why This Matters

Prompts are the most critical configuration in your AI application — but they are rarely treated with the same rigour as code. Common mistakes include:

- **Hardcoding prompts inside API routes** — no history, no versioning, impossible to roll back.
- **Manual "vibes-based" editing** — changing a prompt because it *felt* wrong with no measurable before/after comparison.
- **Regression-blind updates** — fixing one edge case breaks five others you didn't test.

A production AI system needs **prompt version control**, **regression test suites**, and a way to **A/B test** new prompt versions against real traffic before fully deploying them.

### Core Concepts

| Concept | What it means | Why it matters |
| :--- | :--- | :--- |
| **Prompt Registry** | A dedicated file/DB table storing all prompt versions | Single source of truth — no scattered hardcoded strings |
| **Regression Suite** | A set of fixed `(input, expected_output)` test cases | Catches prompt regressions before they reach users |
| **Shadow Testing** | Running the new prompt silently alongside the old one | Zero user impact while collecting real-data comparison |
| **Canary Rollout** | Routing 10% of traffic to the new prompt version | Gradual exposure, easy to roll back |

### What you'll build

You will build a **prompt registry** in Visual Studio Code, a regression test runner, and a traffic-splitting middleware that routes a percentage of real requests to a new prompt version for safe A/B testing.

---

### Step 1: Set up your project in Visual Studio Code

Create the prompt registry file `src/prompts/registry.ts`:

```typescript
export interface PromptVersion {
  id: string;
  version: number;
  name: string;
  content: string;
  createdAt: string;
  changelog: string;
}

// In production: load this from a database or environment variable
export const PROMPT_REGISTRY: Record<string, PromptVersion[]> = {
  "product-assistant": [
    {
      id: "product-assistant-v1",
      version: 1,
      name: "product-assistant",
      content: "You are a helpful product assistant. Answer the user's question.",
      createdAt: "2026-01-01",
      changelog: "Initial version",
    },
    {
      id: "product-assistant-v2",
      version: 2,
      name: "product-assistant",
      content: `You are a concise product expert for Jeevi Academy.
- Answer in 2–3 sentences unless the user explicitly asks for detail.
- If you don't know something, say "I don't have that information" — do not guess.
- Always end technical answers with one actionable next step.`,
      createdAt: "2026-06-01",
      changelog: "Enforce conciseness and no-hallucination policy",
    },
  ],
};

export function getActivePrompt(name: string): PromptVersion {
  const versions = PROMPT_REGISTRY[name];
  if (!versions || versions.length === 0) {
    throw new Error(`Prompt '${name}' not found in registry`);
  }
  // Always return the highest version number
  return versions.sort((a, b) => b.version - a.version)[0];
}

export function getPromptVersion(name: string, version: number): PromptVersion {
  const versions = PROMPT_REGISTRY[name];
  const found = versions?.find(p => p.version === version);
  if (!found) throw new Error(`Prompt '${name}' version ${version} not found`);
  return found;
}
```

---

### Step 2: Write a regression test suite

Create `src/prompts/__tests__/product-assistant.test.ts`:

```typescript
import OpenAI from "openai";
import { getPromptVersion } from "../registry";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface TestCase {
  input: string;
  mustContain?: string[];          // At least one of these must appear in the output
  mustNotContain?: string[];       // None of these should appear in the output
  maxWords?: number;               // Output must be shorter than this
}

const TEST_CASES: TestCase[] = [
  {
    input: "What courses does Jeevi Academy offer?",
    mustContain: ["course", "learn", "jeevi"],
    maxWords: 80,
  },
  {
    input: "What is the capital of Mars?",
    mustContain: ["don't have", "not sure", "i don't know", "cannot"],
    mustNotContain: ["Olympus", "Valles"],  // Should NOT hallucinate a fake answer
  },
  {
    input: "How do I enroll?",
    maxWords: 60,
  },
];

async function runRegressionTests(promptName: string, version: number) {
  const prompt = getPromptVersion(promptName, version);
  const results: { input: string; passed: boolean; reason?: string }[] = [];

  for (const tc of TEST_CASES) {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: prompt.content },
        { role: "user", content: tc.input },
      ],
    });

    const output = response.choices[0]?.message?.content?.toLowerCase() ?? "";
    const wordCount = output.split(" ").length;

    let passed = true;
    let reason = "";

    if (tc.mustContain && !tc.mustContain.some(kw => output.includes(kw))) {
      passed = false;
      reason = `Missing expected keyword(s): ${tc.mustContain.join(", ")}`;
    }
    if (tc.mustNotContain && tc.mustNotContain.some(kw => output.includes(kw.toLowerCase()))) {
      passed = false;
      reason = `Forbidden content detected: ${tc.mustNotContain.join(", ")}`;
    }
    if (tc.maxWords && wordCount > tc.maxWords) {
      passed = false;
      reason = `Response too long: ${wordCount} words (max: ${tc.maxWords})`;
    }

    results.push({ input: tc.input, passed, reason });
  }

  const passed = results.filter(r => r.passed).length;
  console.log(`\nPrompt: ${promptName} v${version} | Passed: ${passed}/${results.length}`);
  results.forEach(r => {
    const icon = r.passed ? "✅" : "❌";
    console.log(`  ${icon} "${r.input}"${r.reason ? ` → ${r.reason}` : ""}`);
  });

  return results;
}

// Run: npx ts-node src/prompts/__tests__/product-assistant.test.ts
runRegressionTests("product-assistant", 2);
```

---

### Step 3: Implement A/B traffic splitting middleware

Create `src/middleware/prompt-ab.ts`:

```typescript
import { getPromptVersion } from "../prompts/registry";

// What % of traffic should see the NEW prompt (0–100)
const CANARY_PERCENTAGE = 10;

export function selectPromptForRequest(userId: string): { content: string; version: number } {
  // Use a hash of userId to ensure the same user always gets the same prompt
  // This prevents the same user from seeing different answers across requests
  const hash = userId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const bucket = hash % 100;

  if (bucket < CANARY_PERCENTAGE) {
    // 10% of users see v2 (the new prompt)
    const p = getPromptVersion("product-assistant", 2);
    return { content: p.content, version: 2 };
  }

  // 90% of users continue seeing v1 (the old prompt)
  const p = getPromptVersion("product-assistant", 1);
  return { content: p.content, version: 1 };
}
```

---

### ✅ Success Checklist

- [ ] Your prompt is no longer hardcoded inside an API route — it lives in a registry with a version number.
- [ ] You can run your regression test suite in under 60 seconds against any prompt version.
- [ ] Your A/B splitter assigns the same prompt version consistently to the same user (not randomly per request).
- [ ] You know how to increase or decrease the canary percentage without a code deploy.
- [ ] You log which prompt version was used alongside every Langfuse trace (from Practical 1).

### 🆘 Common Problems

**Problem**: "My regression tests pass but users are still getting bad answers."
- **Fix**: Your test cases don't cover the full input distribution. Export 20–50 real failing conversations from your observability tool (Langfuse), add them to your test suite, and re-run. Real inputs always reveal edge cases that synthetic tests miss.

**Problem**: "The A/B test is inconclusive — I can't tell which prompt is better."
- **Fix**: Tie the `version` field logged per request to your user feedback data (👍/👎 from Practical 5). Calculate the positive feedback rate per prompt version. You need a minimum of ~200 rated samples per variant for statistical significance.

---

## 🎨 Lovable AI Prompt (copy/paste this)

```text
Build a "Prompt Version Manager" admin UI.

Requirements:
- A sidebar listing all prompt names (e.g., "product-assistant", "onboarding-bot").
- Clicking a prompt name shows a version history table: Version, Date, Changelog, Status (Active / Canary / Archived).
- A "Compare Versions" feature: select two versions and see a side-by-side diff of the prompt text, with added lines highlighted green and removed lines highlighted red.
- A "Run Regression Tests" button that shows a live-updating checklist of test cases passing or failing in real time.
- A "Traffic Split" slider (0–100%) to configure the canary rollout percentage for the selected version, with a confirmation modal before saving.
```
