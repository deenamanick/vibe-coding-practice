# Module 3: AI Prompting (The Brain Interface)

### Why (in simple terms)
If **React** is the engine, **AI Prompting** is the **brain interface**. It's how you teach your app to talk to AI models (like ChatGPT) to get intelligent answers. Instead of just showing static data, your app can now think, reason, and respond like a human assistant.

### What you'll learn
1. **API Integration**: How to securely call AI services from your React app.
2. **State Management**: Handling loading, error, and response states.
3. **Environment Safety**: Why API keys should never live in the browser.
4. **Serverless Proxy**: Using a secure middleman to protect your keys.

---

## 🎨 Lovable AI Prompt (copy/paste this)

```text
Build an "AI Prompting Mini App" using React and Tailwind CSS.

Requirements:
- Layout: A clean, centered interface with a large textarea for questions.
- Components:
  - PromptInput: A controlled component with a character counter.
  - AnswerCard: A card that shows the AI response with a "Copy" button.
  - StatusIndicator: Shows "Thinking...", "Error", or "Ready" states.
- Functionality:
  - Use 'useState' to manage the question, answer, and loading state.
  - Add a "Clear Chat" button to reset the conversation.
  - Use Tailwind for a modern, minimalist design with smooth transitions.
- Design: High-end, ChatGPT-inspired aesthetic with a dark theme option.

Make it look like a premium AI assistant interface!
```

---

## 🌊 Windsurf + Vite Setup (Pro Development)

### Step 1: Initialize with Vite
1. Open **Windsurf** terminal and run:
   ```bash
   npm create vite@latest ai-prompt-app -- --template react
   cd ai-prompt-app
   npm install
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```

### Step 2: Configure Tailwind
Ask Windsurf: `"Set up Tailwind CSS for this React project and configure the content paths."`

### Step 3: Create the AI Component (`src/AskAI.jsx`)
Replace the contents of `App.jsx` with this professional AI chat component.

#### 💡 Code Breakdown:
- **`useState`**: Creates three variables React watches: `question`, `answer`, and `status`.
- **`askAI` function**: An async function that sends the user's question to our secure proxy.
- **`fetch("/api/chat")`**: Calls our serverless function (NOT the AI directly).
- **`disabled` attribute**: Prevents users from clicking the button while the AI is "Thinking...".

```jsx
import { useState } from 'react'

export default function AskAI() {
  // State Management: Three variables React "watches"
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [status, setStatus] = useState('Ready')

  const askAI = async () => {
    // Guard: Don't send empty questions
    if (!question.trim()) return
    
    // Update UI to show we're working
    setStatus('Thinking...')
    setAnswer('')
    
    try {
      // Call our secure proxy (NOT the AI directly)
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_query: question }),
      })

      // Check if the proxy responded correctly
      if (!res.ok) throw new Error("Request failed")
      
      // Get the AI's answer from the proxy
      const data = await res.json()
      setAnswer(data.answer)
      setStatus('Ready')
    } catch (err) {
      // If anything breaks, show a friendly error
      setAnswer('Sorry, something went wrong. Please try again.')
      setStatus('Error')
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">AI Assistant</h1>
      
      {/* Controlled Component: The textarea is "controlled" by React state */}
      <textarea
        className="w-full p-4 border rounded-lg resize-none h-32"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask me anything..."
      />
      
      {/* Conditional Button: Changes text and disables while loading */}
      <button
        onClick={askAI}
        disabled={status === 'Thinking...'}
        className="mt-4 w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50"
      >
        {status === 'Thinking...' ? 'Thinking...' : 'Ask AI'}
      </button>

      {/* Conditional Rendering: Only show the answer if it exists */}
      {answer && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <h3 className="font-bold mb-2">Answer:</h3>
          <p className="whitespace-pre-wrap">{answer}</p>
        </div>
      )}
    </div>
  )
}
```

---

## � Post-Lovable Enhancements (Level Up Your AI App)

Once Lovable generates your beautiful UI, here are **power features** you can add to make it a production-ready AI assistant:

### 1. Conversation History
**What**: Save past questions and answers so users can scroll back.
**How**: Change `const [answer, setAnswer]` to an array:
```jsx
const [messages, setMessages] = useState([])

// When adding a new message:
setMessages(prev => [...prev, { role: 'user', text: question }, { role: 'ai', text: answer }])
```

### 2. Real-Time Streaming (Like ChatGPT)
**What**: Show AI responses as they are generated, word by word.
**How**: Use a `ReadableStream` to process chunks:
```jsx
const reader = response.body.getReader()
while (true) {
  const { done, value } = await reader.read()
  if (done) break
  // Append each chunk to the display
}
```

### 3. Markdown Rendering
**What**: AI often returns formatted text (bold, lists, code). Render it beautifully.
**How**: Install `react-markdown`:
```bash
npm install react-markdown
```
```jsx
import ReactMarkdown from 'react-markdown'
<ReactMarkdown>{answer}</ReactMarkdown>
```

### 4. Copy to Clipboard
**What**: Let users copy AI responses with one click.
**How**: Use the native Clipboard API:
```jsx
const copyToClipboard = () => {
  navigator.clipboard.writeText(answer)
  alert('Copied!')
}
```

### 5. Dark Mode Toggle
**What**: Let users switch between light and dark themes.
**How**: Add a state and toggle Tailwind classes:
```jsx
const [darkMode, setDarkMode] = useState(false)
<div className={darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}>
```

### 6. Auto-Scroll to Bottom
**What**: Automatically scroll to the latest message (like real chat apps).
**How**: Use `useRef` and `scrollIntoView`:
```jsx
const messagesEndRef = useRef(null)
useEffect(() => {
  messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
}, [messages])
```

### 7. File Upload (PDF/Text)
**What**: Let users upload documents for AI analysis.
**How**: Use an `<input type="file">` and send the file as `FormData`:
```jsx
const formData = new FormData()
formData.append('file', selectedFile)
fetch('/api/upload', { method: 'POST', body: formData })
```

### 8. Voice Input (Speak to AI)
**What**: Let users talk instead of type.
**How**: Use the Web Speech API:
```jsx
const recognition = new window.webkitSpeechRecognition()
recognition.onresult = (event) => {
  setQuestion(event.results[0][0].transcript)
}
```

### 9. Persistent Storage (LocalStorage)
**What**: Don't lose chat history on refresh.
**How**: Save and load from browser storage:
```jsx
useEffect(() => {
  localStorage.setItem('chatHistory', JSON.stringify(messages))
}, [messages])
```

### 10. Export Chat (PDF/Text)
**What**: Let users download their conversation.
**How**: Create a blob and trigger download:
```jsx
const exportChat = () => {
  const blob = new Blob([messages.map(m => m.text).join('\n')], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'chat.txt'
  a.click()
}
```

---

## �🔐 Security Note (Critical for Production)

### Why API Keys Must Be Secret
Putting an API key in a Vite `VITE_*` variable exposes it in the built site. Anyone can steal it.

### Recommended: Serverless Proxy
- **Netlify Function** or **Cloudflare Worker** acts as a secure middleman.
- Store your API key in the function's secret env vars (server-side only).
- Your React app calls `/api/chat` on the same domain.

---

## Quick practice tasks
- **Add Typing Indicator**: Show a pulsing "..." animation while the AI is thinking.
- **History**: Use `useState` to keep an array of past questions and answers.
- **Error Handling**: Add a retry button when the API fails.

---

## Checklist
- [ ] Your app can send questions to an AI and display answers.
- [ ] You understand why API keys must be kept server-side.
- [ ] You can handle loading, success, and error states in React.
- [ ] You know how to deploy a serverless function as a proxy.
