# Module 3: Rule-Based Chatbot (The Decision Tree)

### Why (in simple terms)
Not every chatbot needs AI! A **Rule-Based Chatbot** is like a **smart FAQ** that answers questions using simple `if/else` logic. It's perfect for:
- **Customer Support**: Answering common questions instantly
- **No API Costs**: Works 100% offline, no AI key needed
- **Predictable Responses**: Same question = Same answer every time

Think of it as a **decision tree**: "If user asks about courses, show course list. If user asks about price, show pricing."

### What you'll learn
1. **String Matching**: How to detect keywords in user messages.
2. **Conditional Logic**: Using `if/else` to route conversations.
3. **Message History**: Displaying chat bubbles in React.
4. **Quick Chips**: Pre-made buttons for common questions.

---

## 🎨 Lovable AI Prompt (copy/paste this)

```text
Build a "Rule-Based Chatbot" using React and Tailwind CSS.

Requirements:
- Layout: A chat interface with bubbles (user on right, bot on left), input bar at bottom.
- Components:
  - ChatBubble: Shows messages with different styles for user vs bot.
  - QuickChips: 3 buttons for common questions ("Courses", "Duration", "Enroll").
  - ChatInput: Textarea + Send button + Clear Chat button.
- Functionality:
  - Use 'useState' for an array of messages (history).
  - Implement 'getBotReply(userText)' function with if/else rules:
    - If contains "course" or "class" → "We offer: DevOps, UI/UX, Full Stack"
    - If contains "duration" or "time" → "DevOps: 12 weeks, UI/UX: 8 weeks"
    - If contains "enroll" or "join" → "Visit jeeviacademy.com/enroll"
    - Else → "I didn't understand. Try: Courses, Duration, or Enroll"
  - Auto-scroll to latest message.
  - Use Tailwind for a modern chat app aesthetic with rounded bubbles.

Make it look like a friendly customer support chat widget!
```

---

## 🌊 Windsurf + Vite Setup (Pro Development)

### Step 1: Initialize with Vite
1. Open **Windsurf** terminal and run:
   ```bash
   npm create vite@latest rule-chatbot -- --template react
   cd rule-chatbot
   npm install
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```

### Step 2: Configure Tailwind
Ask Windsurf: `"Set up Tailwind CSS for this React project and configure the content paths."`

### Step 3: Create the Chatbot Component (`src/ChatBot.jsx`)
Replace the contents of `App.jsx` with this professional rule-based chatbot.

#### 💡 Code Breakdown:
- **`useState`**: Creates a `messages` array to store the conversation history.
- **`getBotReply` function**: The "brain" that uses `if/else` to match keywords and return responses.
- **`handleSend`**: Adds user message, calls `getBotReply`, adds bot response.
- **`useRef` + `useEffect`**: Auto-scrolls to the latest message (like real chat apps).
- **`toLowerCase().includes()`**: Makes keyword matching case-insensitive.

```jsx
import { useState, useRef, useEffect } from 'react'

export default function ChatBot() {
  // State: Array of all messages in the conversation
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hello! I am your course assistant. Ask me about Courses, Duration, or Enrollment!' }
  ])
  const [input, setInput] = useState('')
  
  // Auto-scroll to bottom when new messages arrive
  const messagesEndRef = useRef(null)
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // The "Brain": Keyword matching with if/else
  const getBotReply = (userText) => {
    const text = userText.toLowerCase()
    
    if (text.includes('course') || text.includes('class') || text.includes('learn')) {
      return '📚 We offer:\n• DevOps Mastery (Docker, K8s, CI/CD)\n• UI/UX Design (Figma, User Research)\n• Full Stack Web (React, Node, Database)'
    }
    
    if (text.includes('duration') || text.includes('time') || text.includes('how long')) {
      return '⏱️ Course Durations:\n• DevOps: 12 weeks (3 months)\n• UI/UX: 8 weeks (2 months)\n• Full Stack: 16 weeks (4 months)'
    }
    
    if (text.includes('enroll') || text.includes('join') || text.includes('sign up')) {
      return '🎯 Ready to join?\nVisit: jeeviacademy.com/enroll\nOr call: +91-9876543210'
    }
    
    // Fallback: Unknown question
    return "🤔 I didn't understand that.\n\nTry asking about:\n• Courses (what we teach)\n• Duration (how long)\n• Enroll (how to join)"
  }

  const handleSend = () => {
    if (!input.trim()) return
    
    // Add user message
    const userMessage = { role: 'user', text: input }
    setMessages(prev => [...prev, userMessage])
    
    // Get bot reply based on rules
    const botReply = getBotReply(input)
    
    // Simulate typing delay
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'bot', text: botReply }])
    }, 500)
    
    setInput('')
  }

  const clearChat = () => {
    setMessages([
      { role: 'bot', text: 'Chat cleared! How can I help you today?' }
    ])
  }

  return (
    <div className="max-w-2xl mx-auto p-4 h-screen flex flex-col">
      <h1 className="text-2xl font-bold text-center mb-4 text-blue-600">Course Assistant 🤖</h1>
      
      {/* Quick Chips */}
      <div className="flex gap-2 mb-4 justify-center flex-wrap">
        {['Courses', 'Duration', 'Enroll'].map(chip => (
          <button
            key={chip}
            onClick={() => setInput(chip)}
            className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200"
          >
            {chip}
          </button>
        ))}
      </div>
      
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto bg-gray-50 rounded-lg p-4 mb-4 border">
        {messages.map((msg, index) => (
          <div key={index} className={`mb-3 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-lg whitespace-pre-wrap ${
              msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input Area */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type your question..."
          className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button onClick={handleSend} className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700">
          Send
        </button>
        <button onClick={clearChat} className="px-4 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400">
          Clear
        </button>
      </div>
    </div>
  )
}
```

---

## 🚀 Post-Lovable Enhancements

Once Lovable generates your UI, add these features:

### 1. Fuzzy Matching
Match words even with typos using string similarity.

### 2. Conversation Context
Remember what the user asked previously.

### 3. Typing Indicator
Show "..." while bot "types".

### 4. Persistent Storage
Save chat on page refresh using localStorage.

---

## Quick practice tasks
- Add more rules for "instructor", "certificate", "placement" questions.
- Add typing animation with pulsing "..." indicator.
- Add sound effects when bot replies.
- Show timestamps on each message.

---

## Checklist
- [ ] Your chatbot detects keywords and returns appropriate responses.
- [ ] You understand how if/else logic replaces AI for simple Q&A.
- [ ] Messages appear in styled bubbles (user right, bot left).
- [ ] Quick chips let users ask common questions with one click.
- [ ] The chat auto-scrolls to show the latest message.
