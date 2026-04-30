## Practical 2: What are Embeddings? (Text to Numbers)

### Why (in simple terms)

Computers are great at math (numbers) but terrible at "understanding" language (text).

**The Challenge**: 
How do you tell a computer that "cat" is similar to "kitten", but "car" is totally different?
- **Keywords**: Searching for "cat" won't find "kitten".
- **Meaning**: Searching for "feline" should find "cat".

**The Solution: Embeddings**
Embeddings are a way to turn **text into a long list of numbers** (called a "Vector").
- "Cat" becomes `[0.12, -0.45, 0.88, ...]`
- "Kitten" becomes `[0.11, -0.44, 0.89, ...]` (very similar numbers!)
- "Car" becomes `[0.99, 0.01, -0.22, ...]` (totally different numbers!)

Think of it like **GPS Coordinates for Meaning**:
- Two points close together on a map mean they are physically near each other.
- Two points (vectors) close together in "AI Space" mean they have a similar meaning.

### What you'll build

You'll create an "Embedding Explorer" that:
- Turns different words into numbers (vectors).
- Calculates the "Distance" between words.
- Shows you that "King" and "Queen" are closer than "King" and "Apple".

### Quick start for beginners

**We'll build on the project from Practical 1**

## Step 0: Open your project

1. Open the `rag-basics-practice` folder.
2. Open your terminal in VS Code.

## Step 1: Install a local embedding tool

For learning, we'll use a simple library that doesn't need a credit card.
```bash
npm install sentence-similarity
```

## Step 2: Create the Embedding Tester

Create a file named `embedding-test.js` and paste this:

```js
const similarity = require('sentence-similarity');
const similarityScore = require('similarity-score');

// 1. Our list of words to compare
const words = [
  "cat",
  "kitten",
  "dog",
  "puppy",
  "car",
  "truck",
  "banana",
  "apple"
];

// 2. Simple function to compare two words
function compare(word1, word2) {
  // In a real RAG, we use a complex AI model to get vectors.
  // Here, we're using a simpler version to show the concept.
  const score = similarityScore(word1, word2);
  return (score * 100).toFixed(2);
}

console.log("--- Similarity Scores (higher is more similar) ---");
console.log(`cat vs kitten: ${compare("cat", "kitten")}%`);
console.log(`cat vs dog: ${compare("cat", "dog")}%`);
console.log(`cat vs car: ${compare("cat", "car")}%`);
console.log(`apple vs banana: ${compare("apple", "banana")}%`);
console.log(`apple vs car: ${compare("apple", "car")}%`);

// 3. Why this matters for RAG:
console.log("\n--- The RAG 'Search' Concept ---");
const query = "feline friend";
const database = ["The cat is sleeping", "I love my new car", "Apples are red"];

database.forEach(doc => {
  const score = compare(query, doc);
  console.log(`Query: '${query}' | Doc: '${doc}' | Match: ${score}%`);
});

// 4. 🚀 BRIDGE EXERCISE: Level up your Module 3 Sentiment Bot!
console.log("\n--- Module 3 Upgrade: Semantic Sentiment ---");
const studentReview = "This app is truly magnificent!"; // Note: 'magnificent' wasn't in our Module 3 hardcoded list!

const positiveAnchor = "This is a great and amazing experience";
const negativeAnchor = "This is a terrible and bad experience";

const posScore = compare(studentReview, positiveAnchor);
const negScore = compare(studentReview, negativeAnchor);

console.log(`Review: "${studentReview}"`);
console.log(`Similarity to Positive: ${posScore}%`);
console.log(`Similarity to Negative: ${negScore}%`);

if (posScore > negScore) {
  console.log("Result: Detected POSITIVE sentiment (Semantically!) 😊");
} else {
  console.log("Result: Detected NEGATIVE sentiment (Semantically!) 😠");
}

// 5. 🏗️ PRODUCTION UPGRADE: Real Google Reviews with Groq
// Now, let's see how we can guide a student to build the "REAL" backend
// for their Module 3 Sentiment App using Groq.

/* 
STEP-BY-STEP GUIDE FOR STUDENTS:
1. Replace your hardcoded 'analyzeSentiment' function with a fetch() call to your backend.
2. In your backend (Node.js/Express), use Groq (llama3-70b) to analyze the sentiment.
3. Instead of simple word counts, the AI will use 'Embeddings' logic internally to 
   understand the nuance of real Google Reviews.
*/

async function groqSentimentAnalysis(review) {
  // This is what the student's backend will look like
  console.log("\n[Backend] Calling Groq for Semantic Sentiment Analysis...");
  
  // Note: This is a simulation for the lesson. In Practical 4, they build the real API.
  const mockGroqResponse = {
    sentiment: "positive",
    confidence: 98,
    explanation: "The user used the word 'magnificent' which has a high semantic similarity to 'excellent'."
  };

  return mockGroqResponse;
}
```

## Step 3: Run the test

In terminal, type:
```bash
node embedding-test.js
```

**What you're learning:**
- AI doesn't see "c-a-t", it sees a **pattern of meaning**.
- Even if the words are different ("feline" vs "cat"), the **meaning** (vector) is similar.
- **The Upgrade**: In Module 3, your Sentiment Bot used **Exact Matches** (Hardcoded). If a user said "magnificent", it failed because "magnificent" wasn't in your list. With **Embeddings**, the AI knows "magnificent" is *similar* to "great", so it detects the sentiment anyway!
- **Real-World Ready**: You can now take your Module 3 frontend and connect it to a **Groq Backend**. Instead of counting words, your app will now "understand" real Google Reviews, handling slang, sarcasm, and complex praise effortlessly.
- This is how Google and ChatGPT "understand" what you're looking for!

---

### ✅ Success Checklist

- [ ] `sentence-similarity` installed.
- [ ] You saw how "cat" and "kitten" score higher than "cat" and "car".
- [ ] You understand: **Embedding** = Converting meaning into numbers.

### 🆘 Common Problems

**Problem**: "Scores look weird"
- **Fix**: Simple libraries aren't as smart as OpenAI. Real embeddings use thousands of numbers to be perfectly accurate!

---

## 🎨 Lovable AI Prompt (UI Generation)

```text
Build an "AI Meaning Map" (Embedding Visualizer) UI.

Frontend Requirements:
- A blank 2D canvas representing "AI Space" (a floating galaxy with gravity effects).
- An input box to "Add a word".
- When a word is added, it appears as a "Glowing Point" on the map.
- Words with similar meanings (like "Happy" and "Joyful") should fly towards each other.
- Words with different meanings should stay far apart.
- Hovering over a point shows its "Coordinates" (simulated vector).
- Integration: Sending a word should call a POST /api/embeddings/compare endpoint.

Integration Specs (Mock for Lovable):
- Expecting a POST /api/embeddings/compare endpoint.
- Response structure: { "similarity": 0.95, "coordinates": [x, y] }

(Note: You are building the FRONTEND only. The actual similarity logic and vector calculations will be handled via Windsurf.)
```

---

## 🛠️ Windsurf Integration Guide: Connecting UI to Meaning

Once your "Meaning Map" UI is ready, use **Windsurf** to power it with the `embedding-test.js` logic.

### 1. Export from Lovable
Open your downloaded Lovable project in **Windsurf**.

### 2. Connect the "Meaning" Engine
Update your frontend to talk to your local embedding server:

```javascript
const addWordToMap = async (word) => {
  const response = await fetch('http://localhost:3000/api/embeddings/compare', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ word: word })
  });
  const data = await response.json();
  // Use data.similarity and data.coordinates to position the point in the UI
};
```

This transforms your UI from a simple animation into a functional **Semantic Search** visualization!
