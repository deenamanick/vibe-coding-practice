## Practical 3: Handling AI Responses (JSON vs Text)

### Why (in simple terms)

When you ask an AI a question, it usually gives you a long paragraph of text. This is great for humans to read, but **terrible for computers** to process.

Imagine you want the AI to give you a list of 3 recipe ingredients:
- **Text Response**: "Sure! You need 2 eggs, 1 cup of flour, and 1/2 cup of milk." (Hard for a computer to "extract" the eggs).
- **JSON Response**: `{"ingredients": ["2 eggs", "1 cup flour", "1/2 cup milk"]}` (Perfect for a computer to use in a list!).

**JSON (JavaScript Object Notation)** is the "language of data." By forcing the AI to speak JSON, we can build structured apps like recipe managers, travel planners, or quiz games.

### What you'll build

You'll create a "Smart Recipe Generator" that:
- Uses a System Prompt to force the AI to output **ONLY valid JSON**.
- Parses that JSON in your Node.js code.
- Returns a structured object to your frontend.

### Quick start for beginners

**We'll build on the project from Practical 2**

## Step 0: Open your project

1. Open the `ai-model-practice` folder.
2. Open `server.js` in VS Code.

## Step 1: Create the JSON Handler API

Update `server.js` and add this new endpoint:

```js
// 1. JSON Recipe Generator Endpoint
app.post('/api/recipe/generate', async (req, res) => {
  const { dishName } = req.body;

  if (!dishName) return res.status(400).json({ error: "Dish Name is required" });

  try {
    console.log(`Generating JSON recipe for: ${dishName}`);
    
    // Call the Groq API with "JSON Mode" instructions
    const completion = await groq.chat.completions.create({
      messages: [
        { 
          role: "system", 
          content: "You are a professional chef. Output ONLY valid JSON. " +
                   "Format: { \"dish\": \"string\", \"ingredients\": [\"string\"], \"steps\": [\"string\"] }"
        },
        { role: "user", content: `Give me a simple recipe for ${dishName}` }
      ],
      model: "llama3-8b-8192",
      response_format: { type: "json_object" } // FORCES JSON MODE
    });

    // Extract the raw text from AI
    const rawContent = completion.choices[0].message.content;
    
    // Parse the JSON string into a real JavaScript object
    const recipeData = JSON.parse(rawContent);

    res.json({
      success: true,
      data: recipeData
    });
  } catch (error) {
    console.error("❌ JSON Error:", error.message);
    res.status(500).json({ 
      error: "Failed to generate structured recipe. Make sure the AI outputted valid JSON." 
    });
  }
});
```

## Step 2: Run the server

In terminal, type:
```bash
node server.js
```

---

## Let's test it (easy way)

### Step 3: Test JSON generation

Open a new terminal and try this command:

```bash
curl -X POST http://localhost:3000/api/recipe/generate \
  -H "Content-Type: application/json" \
  -d '{"dishName":"Pancakes"}'
```

**What you're learning:**
- The `response_format: { type: "json_object" }` is a "safety net" that forces the AI to follow your JSON rules.
- `JSON.parse()` is how we turn a "string of text" into a "data object" our code can use.
- Structured data allows you to build much more complex applications than just "chat bots."

---

### ✅ Success Checklist

- [ ] `POST /api/recipe/generate` endpoint added.
- [ ] Response is a clean JSON object (not just a string).
- [ ] AI follows the schema: `dish`, `ingredients`, `steps`.
- [ ] You understand: **JSON** = Data for computers, **Text** = Info for humans.

### 🆘 Common Problems

**Problem**: "Unexpected token in JSON"
- **Fix**: Sometimes the AI adds extra text. Make sure your System Prompt is very strict: "Output ONLY valid JSON."

**Problem**: "Timeout"
- **Fix**: Generating complex JSON can take a few extra seconds. Be patient!

---

## 🛠️ Practice Session: UI Integration

When you use the Lovable prompt below, your frontend will receive a **JSON object**, not just text. You need to map these fields to your UI components.

**Frontend logic for your "Generate" button:**
```javascript
const response = await fetch("http://localhost:3000/api/recipe/generate", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ dishName: userInput })
});

const result = await response.json();

if (result.success) {
  // result.data will look like: 
  // { dish: "...", ingredients: [...], steps: [...] }
  setRecipe(result.data); 
}
```

---

## 🎨 Lovable AI Prompt (Updated)

```text
Build a "Chef's Smart Recipe Card" that integrates with our Backend JSON API.

Requirements:
- Search: A prominent input for "What do you want to cook today?".
- Button: "Generate Magic Recipe" (calls POST http://localhost:3000/api/recipe/generate).
- Interactive Card:
  1. Title: Large serif font for the dish name.
  2. Ingredients: A list with custom checkboxes. When checked, the text should strike through.
  3. Instructions: A vertical timeline or numbered list of steps.
- Data Handling: Parse the JSON response `{ dish, ingredients, steps }` and map it to the UI elements.
- Features: Add a "Shopping List Mode" that highlights only the ingredients.
- Style: Culinary aesthetic (cream background, olive green accents, hand-drawn food icons).

Handle loading states with a "Chef is cooking..." animation.
