# LLM Caching and Optimization Rules

To ensure cost-efficiency and performance, all AI-related modules must follow these standards:

## 1. Redis Caching
- **Mandatory for Static Prompts**: Queries like "Summarise this" or "Translate this" must be cached.
- **Key Format**: `chat:{hash(prompt)}`
- **TTL**: Default to 1 hour (3600 seconds) unless the content is highly dynamic.

## 2. Token Saving in Windsurf
- **Memory Usage**: Use `create_memory` to store core architectural decisions.
- **Workflow Automation**: Define repetitive tasks in `.windsurf/workflows/` to avoid redundant prompt engineering.
- **Rule Enforcement**: Always refer to this rules file when implementing new LLM features.

## 3. Context Window Optimization (History Trimming)
- **Sliding Window**: Do not send the entire conversation history. Limit context to the most recent 6-10 messages.
- **Cost Reduction**: Aim for 30-60% savings by preventing token accumulation in long sessions.
- **Implementation**: Fetch last N messages from DB, sort by timestamp, and reverse for chronological order.

## 4. Model Tiering (Intelligent Routing)
- **Rule of Thumb**: Route simple tasks (classification, short summaries, FAQ) to cheaper/free models.
- **Cheap/Free Options**:
  - `SWE-1.5` (Free/High Performance for simple tasks)
  - `Gemini 2.0 Flash` (Ultra-low latency, high rate limits)
  - `Kimi` (Excellent for long-context summarization at lower cost)
  - `GPT-4o-mini` (General purpose cheap tier)
- **Escalation**: Only use expensive models (e.g., `gpt-4o`, `o1`) for complex reasoning, code generation, or long-form analysis.
- **Automatic Routing**: Implement logic to detect task complexity based on prompt length or intent keywords.

## 5. Lean System Prompts
- **Principle**: Keep system prompts extremely concise. Every word in the system prompt is charged on every single message in the conversation.
- **Target**: Aim for < 50 tokens for standard tasks. Strip conversational filler ("helpful", "knowledgeable", "tries your best").
- **Cost Impact**: Saves 10-20% on total token costs by reducing the repetitive input overhead.

## 6. Output Token Capping
- **Principle**: Match `max_tokens` to the specific task. Output tokens are 3-5x more expensive than input tokens.
- **Standards**:
  - `classify`: 10 tokens
  - `summarize`: 200 tokens
  - `chat`: 500 tokens
  - `document`: 2000 tokens
- **Cost Impact**: Saves 20-50% by preventing the model from generating unnecessarily long "essays" when a sentence suffices.

## 7. Recursive History Summarization
- **Principle**: Instead of keeping raw long-form history, summarize older messages into a compact context paragraph.
- **Threshold**: When history exceeds 20 messages, summarize the first 14 and keep the last 6 raw.
- **Cost Impact**: Saves 50-70% on long-running conversations by replacing thousands of verbose tokens with a few dozen summary tokens.

## 8. Usage Tracking & Quotas
- **Principle**: Log token usage for every API call and implement per-user monthly quotas.
- **Enforcement**:
  - Track `total_tokens` from the API response object.
  - Implement a monthly limit (e.g., 100,000 tokens).
  - Actions when limit reached: Block calls (429 status) or automatically switch to the cheapest available model.
- **Cost Impact**: Prevents "runaway bills" and ensures a few users don't consume the entire budget.

## 9. Semantic Caching (Local Optimization)
- **Principle**: Use local vector similarity (e.g., `similarity-score` or `MiniVectorDB`) to detect semantically identical questions.
- **Mechanism**: 
  - Store previous user prompts and their LLM responses in a local array or SQLite database.
  - Before calling the LLM, compare the current prompt to the stored history using `similarityScore`.
  - If a match exists with a score > 0.90, return the cached result.
- **Cost Impact**: Saves 10-30% by catching variations (e.g., "Summarize this" vs "Give me a summary") without needing external services like Pinecone.
