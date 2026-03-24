## Practical 5: Complete AI chat frontend with history

### Why (in simple terms)

We've built all the backend pieces - now let's create a real frontend!

**Complete chat app needs:**
- Beautiful, modern interface
- Real-time chat experience
- Session management
- Chat history
- User authentication
- Responsive design

Think of it like building the complete ChatGPT interface!

### What you'll build

You'll create a complete frontend that uses all your backend APIs:
- Login/signup interface
- Multi-session chat
- Real-time messaging
- History management
- Search and export
- Professional UI/UX

### Quick start for beginners

**This brings together everything from Practicals 1-4**

## Step 0: Open your chat project

1. Open the `database-practice` folder from Practical 4
2. Make sure your server is running: `node server.js`
3. Ensure you have Groq API key in `.env` file

## Step 1: Create the frontend files

Create these files in your `database-practice` folder:

### index.html (main file)
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Jeevi AI Chat</title>
    <link rel="stylesheet" href="styles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>
    <!-- Login Screen -->
    <div id="loginScreen" class="screen">
        <div class="login-container">
            <div class="login-header">
                <h1><i class="fas fa-robot"></i> Jeevi AI Chat</h1>
                <p>Your intelligent conversation partner</p>
            </div>
            
            <div class="login-forms">
                <!-- Signup Form -->
                <div class="form-container" id="signupForm">
                    <h2>Create Account</h2>
                    <form id="signupFormElement">
                        <input type="email" id="signupEmail" placeholder="Email" required>
                        <input type="password" id="signupPassword" placeholder="Password" required>
                        <button type="submit"><i class="fas fa-user-plus"></i> Sign Up</button>
                    </form>
                    <p>Already have an account? <a href="#" onclick="showLogin()">Login</a></p>
                </div>
                
                <!-- Login Form -->
                <div class="form-container" id="loginForm" style="display: none;">
                    <h2>Welcome Back</h2>
                    <form id="loginFormElement">
                        <input type="email" id="loginEmail" placeholder="Email" required>
                        <input type="password" id="loginPassword" placeholder="Password" required>
                        <button type="submit"><i class="fas fa-sign-in-alt"></i> Login</button>
                    </form>
                    <p>Need an account? <a href="#" onclick="showSignup()">Sign Up</a></p>
                </div>
            </div>
        </div>
    </div>

    <!-- Chat Screen -->
    <div id="chatScreen" class="screen" style="display: none;">
        <!-- Header -->
        <header class="chat-header">
            <div class="header-left">
                <h1><i class="fas fa-robot"></i> Jeevi AI</h1>
                <div class="user-info">
                    <span id="userEmail"></span>
                    <button onclick="logout()" class="logout-btn"><i class="fas fa-sign-out-alt"></i></button>
                </div>
            </div>
            <div class="header-right">
                <button onclick="toggleSearch()" class="header-btn"><i class="fas fa-search"></i></button>
                <button onclick="toggleStats()" class="header-btn"><i class="fas fa-chart-bar"></i></button>
                <button onclick="exportChat()" class="header-btn"><i class="fas fa-download"></i></button>
            </div>
        </header>

        <!-- Main Content -->
        <div class="chat-container">
            <!-- Sidebar -->
            <aside class="sidebar">
                <div class="sidebar-header">
                    <h3>Conversations</h3>
                    <button onclick="createNewSession()" class="new-session-btn">
                        <i class="fas fa-plus"></i> New Chat
                    </button>
                </div>
                <div id="sessionsList" class="sessions-list">
                    <!-- Sessions will be loaded here -->
                </div>
            </aside>

            <!-- Chat Area -->
            <main class="chat-main">
                <!-- Search Panel -->
                <div id="searchPanel" class="panel" style="display: none;">
                    <div class="panel-header">
                        <h3><i class="fas fa-search"></i> Search Chat History</h3>
                        <button onclick="toggleSearch()" class="close-btn"><i class="fas fa-times"></i></button>
                    </div>
                    <div class="panel-content">
                        <input type="text" id="searchInput" placeholder="Search messages...">
                        <button onclick="searchMessages()" class="search-btn">Search</button>
                        <div id="searchResults" class="search-results"></div>
                    </div>
                </div>

                <!-- Stats Panel -->
                <div id="statsPanel" class="panel" style="display: none;">
                    <div class="panel-header">
                        <h3><i class="fas fa-chart-bar"></i> Chat Statistics</h3>
                        <button onclick="toggleStats()" class="close-btn"><i class="fas fa-times"></i></button>
                    </div>
                    <div class="panel-content">
                        <div id="statsContent" class="stats-content">
                            <!-- Stats will be loaded here -->
                        </div>
                    </div>
                </div>

                <!-- Chat Messages -->
                <div class="chat-messages" id="chatMessages">
                    <div class="welcome-message">
                        <i class="fas fa-robot"></i>
                        <h3>Welcome to Jeevi AI Chat!</h3>
                        <p>Start a new conversation or select an existing one from the sidebar.</p>
                    </div>
                </div>

                <!-- Message Input -->
                <div class="message-input-container">
                    <div class="input-group">
                        <textarea id="messageInput" placeholder="Type your message..." rows="1"></textarea>
                        <button id="sendButton" onclick="sendMessage()" disabled>
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                    <div class="input-info">
                        <span id="sessionTitle">Select or create a session to start chatting</span>
                    </div>
                </div>
            </main>
        </div>
    </div>

    <!-- Loading Overlay -->
    <div id="loadingOverlay" class="loading-overlay" style="display: none;">
        <div class="loading-spinner">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Processing...</p>
        </div>
    </div>

    <script src="script.js"></script>
</body>
</html>
```

### styles.css
```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    height: 100vh;
    overflow: hidden;
}

/* Login Screen */
#loginScreen {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-container {
    background: white;
    padding: 2rem;
    border-radius: 20px;
    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
    width: 90%;
    max-width: 400px;
}

.login-header {
    text-align: center;
    margin-bottom: 2rem;
}

.login-header h1 {
    color: #667eea;
    font-size: 2rem;
    margin-bottom: 0.5rem;
}

.login-header p {
    color: #666;
}

.form-container h2 {
    color: #333;
    margin-bottom: 1.5rem;
    text-align: center;
}

.form-container input {
    width: 100%;
    padding: 0.75rem;
    margin-bottom: 1rem;
    border: 2px solid #e1e5e9;
    border-radius: 10px;
    font-size: 1rem;
    transition: border-color 0.3s;
}

.form-container input:focus {
    outline: none;
    border-color: #667eea;
}

.form-container button {
    width: 100%;
    padding: 0.75rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 10px;
    font-size: 1rem;
    cursor: pointer;
    transition: transform 0.2s;
}

.form-container button:hover {
    transform: translateY(-2px);
}

.form-container p {
    text-align: center;
    margin-top: 1rem;
    color: #666;
}

.form-container a {
    color: #667eea;
    text-decoration: none;
}

/* Chat Screen */
.screen {
    height: 100vh;
    display: flex;
    flex-direction: column;
}

.chat-header {
    background: white;
    padding: 1rem 2rem;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 100;
}

.header-left {
    display: flex;
    align-items: center;
    gap: 2rem;
}

.chat-header h1 {
    color: #667eea;
    font-size: 1.5rem;
}

.user-info {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.user-info span {
    color: #666;
}

.logout-btn {
    background: #ff6b6b;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    cursor: pointer;
    transition: background 0.3s;
}

.logout-btn:hover {
    background: #ff5252;
}

.header-right {
    display: flex;
    gap: 0.5rem;
}

.header-btn {
    background: #f8f9fa;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    cursor: pointer;
    transition: background 0.3s;
}

.header-btn:hover {
    background: #e9ecef;
}

/* Chat Container */
.chat-container {
    display: flex;
    flex: 1;
    overflow: hidden;
}

/* Sidebar */
.sidebar {
    width: 300px;
    background: #f8f9fa;
    border-right: 1px solid #dee2e6;
    display: flex;
    flex-direction: column;
}

.sidebar-header {
    padding: 1rem;
    border-bottom: 1px solid #dee2e6;
}

.sidebar-header h3 {
    color: #333;
    margin-bottom: 1rem;
}

.new-session-btn {
    width: 100%;
    padding: 0.75rem;
    background: #667eea;
    color: white;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    transition: background 0.3s;
}

.new-session-btn:hover {
    background: #5a6fd8;
}

.sessions-list {
    flex: 1;
    overflow-y: auto;
    padding: 0.5rem;
}

.session-item {
    padding: 1rem;
    margin-bottom: 0.5rem;
    background: white;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.3s;
    border: 2px solid transparent;
}

.session-item:hover {
    border-color: #667eea;
    transform: translateX(5px);
}

.session-item.active {
    border-color: #667eea;
    background: #f0f3ff;
}

.session-title {
    font-weight: 600;
    color: #333;
    margin-bottom: 0.25rem;
}

.session-preview {
    font-size: 0.875rem;
    color: #666;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.session-time {
    font-size: 0.75rem;
    color: #999;
    margin-top: 0.25rem;
}

/* Chat Main */
.chat-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    background: white;
}

/* Panels */
.panel {
    position: absolute;
    top: 0;
    right: 0;
    width: 400px;
    height: 100%;
    background: white;
    box-shadow: -5px 0 15px rgba(0,0,0,0.1);
    z-index: 200;
    display: flex;
    flex-direction: column;
}

.panel-header {
    padding: 1rem;
    border-bottom: 1px solid #dee2e6;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.panel-header h3 {
    color: #333;
}

.close-btn {
    background: none;
    border: none;
    font-size: 1.25rem;
    cursor: pointer;
    color: #666;
}

.panel-content {
    flex: 1;
    padding: 1rem;
    overflow-y: auto;
}

/* Search */
#searchInput {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid #e1e5e9;
    border-radius: 10px;
    margin-bottom: 1rem;
}

.search-btn {
    width: 100%;
    padding: 0.75rem;
    background: #667eea;
    color: white;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    margin-bottom: 1rem;
}

.search-results {
    max-height: 400px;
    overflow-y: auto;
}

.search-result-item {
    padding: 1rem;
    border: 1px solid #e1e5e9;
    border-radius: 10px;
    margin-bottom: 0.5rem;
}

.search-highlight {
    background: #fff3cd;
    padding: 0.25rem;
    border-radius: 3px;
}

/* Chat Messages */
.chat-messages {
    flex: 1;
    padding: 2rem;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.welcome-message {
    text-align: center;
    padding: 3rem;
    color: #666;
}

.welcome-message i {
    font-size: 4rem;
    color: #667eea;
    margin-bottom: 1rem;
}

.message {
    max-width: 70%;
    padding: 1rem;
    border-radius: 15px;
    animation: messageSlide 0.3s ease-out;
}

.message.user {
    align-self: flex-end;
    background: #667eea;
    color: white;
}

.message.ai {
    align-self: flex-start;
    background: #f8f9fa;
    border: 1px solid #dee2e6;
}

.message-content {
    margin-bottom: 0.5rem;
    line-height: 1.5;
}

.message-time {
    font-size: 0.75rem;
    opacity: 0.7;
}

@keyframes messageSlide {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Message Input */
.message-input-container {
    padding: 1rem 2rem;
    border-top: 1px solid #dee2e6;
    background: white;
}

.input-group {
    display: flex;
    gap: 1rem;
    align-items: flex-end;
}

#messageInput {
    flex: 1;
    padding: 0.75rem;
    border: 2px solid #e1e5e9;
    border-radius: 20px;
    resize: none;
    font-family: inherit;
    max-height: 100px;
}

#messageInput:focus {
    outline: none;
    border-color: #667eea;
}

#sendButton {
    padding: 0.75rem 1.5rem;
    background: #667eea;
    color: white;
    border: none;
    border-radius: 20px;
    cursor: pointer;
    transition: background 0.3s;
}

#sendButton:hover:not(:disabled) {
    background: #5a6fd8;
}

#sendButton:disabled {
    background: #ccc;
    cursor: not-allowed;
}

.input-info {
    margin-top: 0.5rem;
    font-size: 0.875rem;
    color: #666;
}

/* Loading */
.loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.loading-spinner {
    background: white;
    padding: 2rem;
    border-radius: 15px;
    text-align: center;
}

.loading-spinner i {
    font-size: 2rem;
    color: #667eea;
    margin-bottom: 1rem;
}

/* Responsive */
@media (max-width: 768px) {
    .sidebar {
        width: 250px;
    }
    
    .panel {
        width: 100%;
    }
    
    .chat-header {
        padding: 1rem;
    }
    
    .header-left h1 {
        font-size: 1.25rem;
    }
    
    .message {
        max-width: 85%;
    }
}

@media (max-width: 480px) {
    .sidebar {
        position: absolute;
        left: -250px;
        transition: left 0.3s;
        z-index: 300;
    }
    
    .sidebar.open {
        left: 0;
    }
    
    .chat-messages {
        padding: 1rem;
    }
    
    .message-input-container {
        padding: 1rem;
    }
}
```

### script.js
```javascript
// Global variables
let currentUser = null;
let currentSession = null;
let sessions = [];

// API Base URL
const API_BASE = 'http://localhost:3000';

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in (from localStorage)
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showChatScreen();
    }
    
    // Setup form listeners
    document.getElementById('signupFormElement').addEventListener('submit', handleSignup);
    document.getElementById('loginFormElement').addEventListener('submit', handleLogin);
    
    // Setup message input
    const messageInput = document.getElementById('messageInput');
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // Auto-resize textarea
    messageInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 100) + 'px';
    });
});

// Auth functions
function showSignup() {
    document.getElementById('signupForm').style.display = 'block';
    document.getElementById('loginForm').style.display = 'none';
}

function showLogin() {
    document.getElementById('signupForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
}

async function handleSignup(e) {
    e.preventDefault();
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    
    try {
        showLoading();
        const response = await fetch(`${API_BASE}/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert('Account created successfully! Please login.');
            showLogin();
        } else {
            alert(data.error || 'Signup failed');
        }
    } catch (error) {
        alert('Network error. Please try again.');
    } finally {
        hideLoading();
    }
}

async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        showLoading();
        const response = await fetch(`${API_BASE}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            currentUser = data.user;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            showChatScreen();
        } else {
            alert(data.error || 'Login failed');
        }
    } catch (error) {
        alert('Network error. Please try again.');
    } finally {
        hideLoading();
    }
}

function logout() {
    currentUser = null;
    currentSession = null;
    localStorage.removeItem('currentUser');
    showLoginScreen();
}

// Screen management
function showLoginScreen() {
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('chatScreen').style.display = 'none';
}

function showChatScreen() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('chatScreen').style.display = 'flex';
    
    // Update user info
    document.getElementById('userEmail').textContent = currentUser.email;
    
    // Load sessions
    loadSessions();
}

// Session management
async function loadSessions() {
    try {
        const response = await fetch(`${API_BASE}/api/sessions/${currentUser.id}`);
        const data = await response.json();
        
        if (response.ok) {
            sessions = data.sessions;
            renderSessions();
        }
    } catch (error) {
        console.error('Failed to load sessions:', error);
    }
}

function renderSessions() {
    const sessionsList = document.getElementById('sessionsList');
    
    if (sessions.length === 0) {
        sessionsList.innerHTML = '<p style="text-align: center; color: #666; padding: 1rem;">No conversations yet. Create your first chat!</p>';
        return;
    }
    
    sessionsList.innerHTML = sessions.map(session => `
        <div class="session-item ${currentSession && currentSession.id === session.id ? 'active' : ''}" 
             onclick="selectSession(${session.id})">
            <div class="session-title">${session.title}</div>
            <div class="session-preview">${session.last_message || 'No messages yet'}</div>
            <div class="session-time">${formatTime(session.updated_at)}</div>
        </div>
    `).join('');
}

async function createNewSession() {
    const title = prompt('Enter a title for your new conversation:');
    if (!title) return;
    
    try {
        showLoading();
        const response = await fetch(`${API_BASE}/api/sessions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: currentUser.id,
                title: title
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            sessions.unshift(data.session);
            renderSessions();
            selectSession(data.session.id);
        } else {
            alert(data.error || 'Failed to create session');
        }
    } catch (error) {
        alert('Network error. Please try again.');
    } finally {
        hideLoading();
    }
}

async function selectSession(sessionId) {
    currentSession = sessions.find(s => s.id === sessionId);
    
    if (!currentSession) return;
    
    // Update UI
    renderSessions();
    document.getElementById('sessionTitle').textContent = `Chatting in: ${currentSession.title}`;
    document.getElementById('sendButton').disabled = false;
    
    // Load messages
    await loadSessionMessages();
}

async function loadSessionMessages() {
    try {
        const response = await fetch(`${API_BASE}/api/sessions/${currentSession.id}/messages?user_id=${currentUser.id}`);
        const data = await response.json();
        
        if (response.ok) {
            renderMessages(data.messages);
        }
    } catch (error) {
        console.error('Failed to load messages:', error);
    }
}

function renderMessages(messages) {
    const chatMessages = document.getElementById('chatMessages');
    
    if (messages.length === 0) {
        chatMessages.innerHTML = `
            <div class="welcome-message">
                <i class="fas fa-robot"></i>
                <h3>Start the conversation!</h3>
                <p>This is a new chat session. Send a message to begin.</p>
            </div>
        `;
        return;
    }
    
    chatMessages.innerHTML = messages.map(msg => `
        <div class="message ${msg.user_message ? 'user' : 'ai'}">
            <div class="message-content">${msg.user_message || msg.ai_response}</div>
            <div class="message-time">${formatTime(msg.timestamp)}</div>
        </div>
    `).join('');
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Chat functions
async function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();
    
    if (!message || !currentSession) return;
    
    // Add user message to UI
    addMessageToUI(message, 'user');
    messageInput.value = '';
    messageInput.style.height = 'auto';
    
    // Disable send button while waiting
    document.getElementById('sendButton').disabled = true;
    
    try {
        const response = await fetch(`${API_BASE}/api/sessions/${currentSession.id}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: currentUser.id,
                message: message
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            addMessageToUI(data.ai_response, 'ai');
            
            // Update session preview
            const sessionIndex = sessions.findIndex(s => s.id === currentSession.id);
            if (sessionIndex !== -1) {
                sessions[sessionIndex].last_message = message;
                sessions[sessionIndex].updated_at = new Date().toISOString();
                renderSessions();
            }
        } else {
            addMessageToUI('Sorry, I encountered an error. Please try again.', 'ai');
        }
    } catch (error) {
        addMessageToUI('Network error. Please check your connection.', 'ai');
    } finally {
        document.getElementById('sendButton').disabled = false;
    }
}

function addMessageToUI(content, type) {
    const chatMessages = document.getElementById('chatMessages');
    
    // Remove welcome message if present
    const welcomeMessage = chatMessages.querySelector('.welcome-message');
    if (welcomeMessage) {
        welcomeMessage.remove();
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.innerHTML = `
        <div class="message-content">${content}</div>
        <div class="message-time">${formatTime(new Date())}</div>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Panel functions
function toggleSearch() {
    const panel = document.getElementById('searchPanel');
    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    
    if (panel.style.display === 'block') {
        document.getElementById('searchInput').focus();
    }
}

function toggleStats() {
    const panel = document.getElementById('statsPanel');
    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    
    if (panel.style.display === 'block') {
        loadStats();
    }
}

async function searchMessages() {
    const searchTerm = document.getElementById('searchInput').value.trim();
    if (!searchTerm) return;
    
    try {
        showLoading();
        const response = await fetch(`${API_BASE}/api/chat/search/${currentUser.id}?q=${encodeURIComponent(searchTerm)}`);
        const data = await response.json();
        
        if (response.ok) {
            renderSearchResults(data.results, data.search_term);
        } else {
            alert(data.error || 'Search failed');
        }
    } catch (error) {
        alert('Network error. Please try again.');
    } finally {
        hideLoading();
    }
}

function renderSearchResults(results, searchTerm) {
    const resultsContainer = document.getElementById('searchResults');
    
    if (results.length === 0) {
        resultsContainer.innerHTML = '<p>No messages found matching your search.</p>';
        return;
    }
    
    resultsContainer.innerHTML = results.map(result => `
        <div class="search-result-item">
            <div class="message-content">
                <strong>You:</strong> ${highlightText(result.user_message, searchTerm)}
            </div>
            <div class="message-content">
                <strong>AI:</strong> ${highlightText(result.ai_response, searchTerm)}
            </div>
            <div class="message-time">${formatTime(result.timestamp)}</div>
        </div>
    `).join('');
}

function highlightText(text, searchTerm) {
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<span class="search-highlight">$1</span>');
}

async function loadStats() {
    try {
        const response = await fetch(`${API_BASE}/api/chat/stats/${currentUser.id}`);
        const data = await response.json();
        
        if (response.ok) {
            renderStats(data.statistics);
        }
    } catch (error) {
        console.error('Failed to load stats:', error);
    }
}

function renderStats(stats) {
    const statsContent = document.getElementById('statsContent');
    
    statsContent.innerHTML = `
        <div class="stat-item">
            <i class="fas fa-comments"></i>
            <div>
                <div class="stat-number">${stats.total_messages}</div>
                <div class="stat-label">Total Messages</div>
            </div>
        </div>
        <div class="stat-item">
            <i class="fas fa-calendar"></i>
            <div>
                <div class="stat-number">${stats.chat_duration_days}</div>
                <div class="stat-label">Days Chatting</div>
            </div>
        </div>
        <div class="stat-item">
            <i class="fas fa-ruler"></i>
            <div>
                <div class="stat-number">${stats.average_message_length}</div>
                <div class="stat-label">Avg Message Length</div>
            </div>
        </div>
        <div class="stat-item">
            <i class="fas fa-reply"></i>
            <div>
                <div class="stat-number">${stats.average_response_length}</div>
                <div class="stat-label">Avg Response Length</div>
            </div>
        </div>
    `;
}

async function exportChat() {
    try {
        showLoading();
        const response = await fetch(`${API_BASE}/api/chat/export/${currentUser.id}`);
        
        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `chat_history_${currentUser.email}_${Date.now()}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } else {
            alert('Failed to export chat history');
        }
    } catch (error) {
        alert('Network error. Please try again.');
    } finally {
        hideLoading();
    }
}

// Utility functions
function showLoading() {
    document.getElementById('loadingOverlay').style.display = 'flex';
}

function hideLoading() {
    document.getElementById('loadingOverlay').style.display = 'none';
}

function formatTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
}
```

## Step 2: Test your complete chat app

1. **Make sure your server is running**:
   ```bash
   node server.js
   ```

2. **Open the frontend**:
   - Double-click `index.html` in your folder
   - Or use VS Code Live Server

3. **Try the complete experience**:
   - Create a new account
   - Login
   - Create a chat session
   - Send messages
   - Try search, stats, and export

---

### ✅ Success Checklist

- [ ] Login/signup interface works
- [ ] Multiple chat sessions can be created
- [ ] AI responses maintain conversation context
- [ ] Search finds messages across all sessions
- [ ] Statistics show chat usage data
- [ ] Export downloads chat history
- [ ] UI is responsive and modern
- [ ] Real-time feel with animations

### 🆘 Common Problems

**Problem**: "CORS error" in browser
- **Fix**: Make sure your server has `cors()` middleware
- **Fix**: Check server is running on port 3000

**Problem**: "Network error" when calling API
- **Fix**: Make sure backend server is running
- **Fix**: Check API_BASE URL in script.js

**Problem**: Messages not appearing
- **Fix**: Check browser console for errors
- **Fix**: Make sure you have an OpenAI API key in `.env`

**Problem**: Search not working
- **Fix**: Make sure you have messages to search through
- **Fix**: Try different search terms

---

## � Lovable AI Prompt (copy/paste this)

```text
Build a "Complete AI Chat Application" - a production-ready chat app with all features integrated.

Requirements:
- Modern React/Vue/Next.js application with professional UI/UX
- Backend: http://localhost:3000
- Use fetch() with real-time WebSocket-like experience
- Must be mobile-responsive and production-ready

Core Features to Implement:
1. Authentication System
   - Login/Signup screens with validation
   - JWT token management
   - User profile display
   - Logout functionality

2. Multi-Session Chat Interface
   - Session sidebar (Slack/Discord style)
   - Create/rename/delete sessions
   - Session switching with state management
   - Active session highlighting

3. AI Chat with Context
   - Real-time messaging with typing indicators
   - Context-aware AI responses
   - Message persistence
   - Error handling for AI failures

4. Advanced Features
   - Search through chat history
   - Paginated message loading
   - Chat statistics dashboard
   - Export chat history (JSON/CSV)
   - Message deletion with confirmation

5. Professional UI/UX
   - Modern design with animations
   - Dark/light theme toggle
   - Mobile-responsive layout
   - Loading states and error handling
   - Keyboard shortcuts

Technical Requirements:
- State management for user sessions
- Real-time updates without page refresh
- LocalStorage for session persistence
- Smooth animations and transitions
- Handle network errors gracefully
- Professional loading states

API Endpoints to Use:
- POST /signup, POST /login (auth)
- POST /api/sessions (create sessions)
- POST /api/sessions/{id}/chat (chat with context)
- GET /api/sessions/{id}/messages (session history)
- GET /api/chat/search/{id} (search)
- GET /api/chat/stats/{id} (statistics)
- GET /api/chat/export/{id} (export)

Design Inspiration:
- ChatGPT/Claude interface
- Slack/Discord sidebar
- Modern dashboard layouts
- Professional SaaS applications

Make this look like a real, production-ready AI chat application that could be launched as a startup!
```
