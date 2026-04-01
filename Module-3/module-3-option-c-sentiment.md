# Module 3: Sentiment Checker (The Mood Detector)

### Why (in simple terms)
A **Sentiment Checker** is like a **mood detector** for text. It analyzes whether a sentence sounds positive, negative, or neutral. This is incredibly useful for:
- **Customer Feedback**: Automatically categorize reviews as happy or unhappy
- **Social Media**: Track public opinion about your brand
- **No AI Needed**: Start with simple word rules, upgrade to AI later

Think of it as a **word detective**: "If the sentence contains 'love' or 'amazing', it's positive. If it has 'hate' or 'terrible', it's negative."

### What you'll learn
1. **Word Arrays**: How to store and search through lists of positive/negative words.
2. **String Analysis**: Breaking down sentences to count emotional words.
3. **Conditional Logic**: Using `if/else` to determine sentiment based on word counts.
4. **Visual Feedback**: Using colors and emojis to show sentiment results.

---

## 🎨 Lovable AI Prompt (copy/paste this)

```text
Build a "Sentiment Checker" using React and Tailwind CSS.

Requirements:
- Layout: A clean, centered interface with a large textarea for text input.
- Components:
  - TextInput: A controlled textarea with a character counter.
  - AnalyzeButton: A button that triggers sentiment analysis.
  - ResultCard: Shows sentiment with emoji, color, and confidence score.
- Functionality:
  - Use 'useState' for input text and sentiment result.
  - Implement 'analyzeSentiment(text)' function with word arrays:
    - Positive words: ['good', 'great', 'love', 'amazing', 'excellent']
    - Negative words: ['bad', 'hate', 'terrible', 'awful', 'worst']
  - Show emoji (😊/😠/😐) and color (green/red/gray) based on result.
  - Display a confidence percentage based on word count.
  - Use Tailwind for smooth transitions and hover effects.

Make it look like a professional sentiment analysis tool!
```

---

## 🌊 Windsurf + Vite Setup (Pro Development)

### Step 1: Initialize with Vite
1. Open **Windsurf** terminal and run:
   ```bash
   npm create vite@latest sentiment-app -- --template react
   cd sentiment-app
   npm install
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```

### Step 2: Configure Tailwind
Ask Windsurf: `"Set up Tailwind CSS for this React project and configure the content paths."`

### Step 3: Create the Sentiment Component (`src/SentimentChecker.jsx`)
Replace the contents of `App.jsx` with this professional sentiment analyzer.

#### 💡 Code Breakdown:
- **Word Arrays**: Lists of positive and negative words to match against.
- **`analyzeSentiment` function**: Counts positive/negative words and determines the mood.
- **Confidence Score**: Shows how "sure" we are based on how many emotional words were found.
- **Visual Feedback**: Uses emojis and colors to make results instantly understandable.

```jsx
import { useState } from 'react'

export default function SentimentChecker() {
  const [text, setText] = useState('')
  const [result, setResult] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  // Word banks for sentiment analysis
  const positiveWords = [
    'good', 'great', 'love', 'amazing', 'excellent', 'fantastic', 
    'wonderful', 'best', 'awesome', 'perfect', 'happy', 'pleased'
  ]
  
  const negativeWords = [
    'bad', 'hate', 'terrible', 'awful', 'worst', 'horrible',
    'disgusting', 'disappointing', 'sad', 'angry', 'frustrated', 'poor'
  ]

  const analyzeSentiment = (inputText) => {
    if (!inputText.trim()) return null

    // Convert to lowercase and split into words
    const words = inputText.toLowerCase().split(/\s+/)
    
    // Count emotional words
    let positiveCount = 0
    let negativeCount = 0
    
    words.forEach(word => {
      if (positiveWords.includes(word)) positiveCount++
      if (negativeWords.includes(word)) negativeCount++
    })

    // Determine sentiment
    let sentiment = 'neutral'
    let emoji = '😐'
    let color = 'gray'
    
    if (positiveCount > negativeCount) {
      sentiment = 'positive'
      emoji = '😊'
      color = 'green'
    } else if (negativeCount > positiveCount) {
      sentiment = 'negative'
      emoji = '😠'
      color = 'red'
    }

    // Calculate confidence based on emotional word density
    const emotionalWords = positiveCount + negativeCount
    const confidence = Math.min(95, emotionalWords * 20 + 55)

    return {
      sentiment,
      emoji,
      color,
      confidence,
      positiveCount,
      negativeCount,
      wordCount: words.length
    }
  }

  const handleAnalyze = () => {
    setIsAnalyzing(true)
    
    // Simulate processing delay for better UX
    setTimeout(() => {
      const analysis = analyzeSentiment(text)
      setResult(analysis)
      setIsAnalyzing(false)
    }, 800)
  }

  const getColorClasses = (color) => {
    const colors = {
      green: 'bg-green-100 text-green-800 border-green-300',
      red: 'bg-red-100 text-red-800 border-red-300',
      gray: 'bg-gray-100 text-gray-800 border-gray-300'
    }
    return colors[color] || colors.gray
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-2">Sentiment Checker 🎭</h1>
      <p className="text-center text-gray-600 mb-8">
        Discover the emotional tone of your text
      </p>
      
      {/* Input Section */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          Enter text to analyze:
        </label>
        <textarea
          className="w-full p-4 border rounded-lg resize-none h-32 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste your text here... For example: 'I love this amazing product!'"
        />
        <div className="mt-2 text-sm text-gray-500">
          Characters: {text.length}
        </div>
      </div>
      
      {/* Analyze Button */}
      <button
        onClick={handleAnalyze}
        disabled={!text.trim() || isAnalyzing}
        className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition mb-6"
      >
        {isAnalyzing ? 'Analyzing...' : 'Analyze Sentiment'}
      </button>

      {/* Results Section */}
      {result && (
        <div className={`p-6 rounded-lg border-2 ${getColorClasses(result.color)}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{result.emoji}</span>
              <div>
                <h2 className="text-2xl font-bold capitalize">
                  {result.sentiment}
                </h2>
                <p className="text-sm opacity-75">
                  Confidence: {result.confidence}%
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm opacity-75">Words analyzed</div>
              <div className="text-lg font-semibold">{result.wordCount}</div>
            </div>
          </div>
          
          {/* Word Breakdown */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-current border-opacity-20">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {result.positiveCount}
              </div>
              <div className="text-sm">Positive words</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {result.negativeCount}
              </div>
              <div className="text-sm">Negative words</div>
            </div>
          </div>
        </div>
      )}
      
      {/* Quick Examples */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold mb-2">Try these examples:</h3>
        <div className="space-y-2">
          {[
            "This product is absolutely amazing and I love it!",
            "The service was terrible and I hate the experience.",
            "It's okay, nothing special but not bad either."
          ].map((example, index) => (
            <button
              key={index}
              onClick={() => setText(example)}
              className="block w-full text-left p-2 bg-white rounded hover:bg-blue-100 transition text-sm"
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
```

---

## 🚀 Post-Lovable Enhancements (Level Up Your Sentiment Tool)

Once Lovable generates your UI, add these advanced features:

### 1. Emotion Detection (Beyond Positive/Negative)
**What**: Detect specific emotions like joy, anger, fear.
**How**: Create emotion word arrays:
```jsx
const emotions = {
  joy: ['happy', 'excited', 'thrilled'],
  anger: ['furious', 'enraged', 'livid'],
  fear: ['scared', 'terrified', 'afraid']
}
```

### 2. Real-Time Analysis
**What**: Show sentiment as user types.
**How**: Use `useEffect` with debounce:
```jsx
useEffect(() => {
  const timer = setTimeout(() => {
    if (text.length > 10) {
      setResult(analyzeSentiment(text))
    }
  }, 500)
  return () => clearTimeout(timer)
}, [text])
```

### 3. Sentiment History
**What**: Save past analyses to track mood changes.
**How**: Use localStorage:
```jsx
const [history, setHistory] = useState([])
// Save each analysis with timestamp
```

### 4. Export Results
**What**: Let users download sentiment reports.
**How**: Create CSV export:
```jsx
const exportCSV = () => {
  const csv = "Text,Sentiment,Confidence\n" + 
    history.map(h => `"${h.text}",${h.sentiment},${h.confidence}`).join('\n')
  // Download logic...
}
```

---

## Quick practice tasks
- **Add More Words**: Expand the positive/negative word arrays with 20+ words each.
- **Intensity Scoring**: Add weights to words (e.g., "excellent" = +2, "good" = +1).
- **Negation Handling**: Detect phrases like "not good" and reverse the sentiment.
- **Emoji Support**: Count emojis like 😊, 😠, 😐 in the sentiment analysis.

---

## Checklist
- [ ] Your sentiment checker can analyze text and return positive/negative/neutral.
- [ ] You understand how word arrays replace AI for simple sentiment analysis.
- [ ] The UI shows visual feedback with emojis and colors.
- [ ] Confidence scores are calculated based on emotional word density.
- [ ] Users can try pre-written examples to test the functionality.
