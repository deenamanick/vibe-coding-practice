# Module 10: RAG Basics (Retrieval Augmented Generation)

This module teaches you how to give AI a "long-term memory" using RAG. You'll learn how to make AI answer questions about your own private documents and data.

## Practicals

- `module-10-1-why-ai-forgets.md` — Why AI forgets (Context window vs RAG)
- `module-10-2-what-is-embeddings.md` — What are Embeddings? (Turning text into numbers)
- `module-10-3-vector-database-concept.md` — Vector Database concept (Storing and searching memories)
- `module-10-4-basic-document-qa.md` — Project: Basic Document Q&A System
- `module-10-5-caching-llm-responses.md` — Optimization: Redis Caching & Token Saving
- `module-10-6-production-sentiment-upgrade.md` — Project Upgrade: Real Google Reviews with Groq

### Recommended order

1. Why AI forgets
2. What are Embeddings?
3. Vector Database concept
4. Basic Document Q&A System
5. Optimization: Response Caching
6. Production-Grade Sentiment Upgrade

### Prerequisites

- Complete Module 9 (AI Model Integration)
- Node.js and Express experience
- Basic understanding of JSON

### 🚀 Why RAG?

**RAG is the "Superpower" of modern AI:**
- ✅ **No Hallucinations**: AI only answers based on your documents.
- ✅ **Private Data**: AI can learn about your company, your notes, or your school books.
- ✅ **Up-to-date**: Unlike models which are trained on old data, RAG can use information from 1 second ago.

### Tech Stack

- **Backend**: Node.js, Express
- **AI Models**: Groq (for chat), OpenAI or local transformers (for embeddings)
- **Vector Storage**: In-memory (for learning) or Pinecone/Supabase (for production)
- **UI/UX**: Document upload and AI Chat interface
