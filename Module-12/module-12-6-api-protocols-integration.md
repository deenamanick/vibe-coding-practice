## Practical 6: API Protocols & Integration (Real-World API Patterns)

### Why (in simple terms)

Not all APIs are simple GET/POST. In the real world, you deal with:
- **Authentication** (Who are you?)
- **Rate limiting** (Don't spam our server!)
- **Webhooks** (Tell me when something happens)
- **Error handling** (What went wrong and why?)

**The Problem: Naive API Integration**
- Calling APIs without handling errors
- Ignoring rate limits and getting banned
- Storing API responses without validation
- Not implementing retries for failed requests

**The Solution: Professional API Integration**
- Always check status codes before parsing
- Implement exponential backoff for retries
- Validate incoming data before using it
- Use API keys securely (Module 11.2!)

### ❌ Common Mistakes

- ❌ Not handling 429 "Too Many Requests" errors
- ❌ Retrying immediately after failure (no backoff)
- ❌ Trusting external API responses without validation
- ❌ Hardcoding API URLs without environment variables
- ❌ Not setting request timeouts (hanging forever)

### What you'll build

You'll create a **Weather API Client** that:
- Fetches real weather data from a public API
- Implements retry logic with exponential backoff
- Validates and sanitizes the response
- Caches results to avoid repeated calls
- Handles errors gracefully

### Quick start for beginners

**We'll build on the project from Practical 5**

## Step 0: Open your project

1. Open the `testing-practice` folder.
2. Open your terminal in VS Code.

## Step 1: Install the tools

```bash
npm install axios dotenv
```

## Step 2: Create the API Client

Create `api-client.js`:

```js
require('dotenv').config();
const axios = require('axios');

// Cache to avoid repeated API calls
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function fetchWithRetry(url, options = {}, retries = 3) {
  const delay = (ms) => new Promise(r => setTimeout(r, ms));
  
  for (let i = 0; i < retries; i++) {
    try {
      const response = await axios({ url, timeout: 5000, ...options });
      return response.data;
    } catch (error) {
      const isLastAttempt = i === retries - 1;
      const status = error.response?.status;
      
      // Don't retry client errors (4xx)
      if (status >= 400 && status < 500) throw error;
      
      // Exponential backoff: 1s, 2s, 4s
      if (!isLastAttempt) {
        const waitTime = Math.pow(2, i) * 1000;
        console.log(`Retry ${i + 1}/${retries} after ${waitTime}ms`);
        await delay(waitTime);
      }
    }
  }
  throw new Error('Max retries reached');
}

function validateWeatherData(data) {
  if (!data || typeof data !== 'object') return false;
  if (!data.location || !data.current) return false;
  if (typeof data.current.temperature !== 'number') return false;
  return true;
}

async function getWeather(city) {
  // Check cache first
  const cacheKey = city.toLowerCase();
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log(`[CACHE] Returning cached data for ${city}`);
    return cached.data;
  }

  try {
    // Using a free public weather API (Open-Meteo)
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`;
    const geoData = await fetchWithRetry(geoUrl);
    
    if (!geoData.results || geoData.results.length === 0) {
      throw new Error(`City "${city}" not found`);
    }

    const { latitude, longitude, name } = geoData.results[0];
    
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
    const weatherData = await fetchWithRetry(weatherUrl);

    const result = {
      location: name,
      current: {
        temperature: weatherData.current_weather.temperature,
        windSpeed: weatherData.current_weather.windspeed,
        windDirection: weatherData.current_weather.winddirection,
        time: weatherData.current_weather.time
      }
    };

    if (!validateWeatherData(result)) {
      throw new Error('Invalid weather data received from API');
    }

    // Store in cache
    cache.set(cacheKey, { data: result, timestamp: Date.now() });
    return result;

  } catch (error) {
    console.error(`Weather API Error: ${error.message}`);
    return {
      error: true,
      message: error.message,
      suggestion: "Please try a different city name or try again later."
    };
  }
}

// Demo
async function runDemo() {
  console.log('--- Weather API Client Demo ---\n');
  
  const cities = ['London', 'Tokyo', 'InvalidCity123'];
  
  for (const city of cities) {
    console.log(`Fetching weather for: ${city}`);
    const data = await getWeather(city);
    console.log(JSON.stringify(data, null, 2));
    console.log('---');
  }
  
  // Test cache
  console.log('\n--- Testing Cache ---');
  const cached = await getWeather('London');
  console.log('Cache hit:', !cached.error);
}

runDemo();
```

## Step 3: Run the client

```bash
node api-client.js
```

**What you're learning:**
- **Retry logic**: Exponential backoff prevents spamming APIs
- **Caching**: Reduces API calls and improves speed
- **Validation**: Never trust external data blindly
- **Error handling**: Graceful failures with helpful messages
- **Timeouts**: Prevents hanging requests

---

### ✅ Success Checklist

- [ ] `axios` and `dotenv` installed.
- [ ] API calls include timeout handling.
- [ ] Retry logic with exponential backoff implemented.
- [ ] Cache prevents repeated calls within 5 minutes.
- [ ] Invalid city names return graceful error messages.
- [ ] External API response validated before use.

### 🆘 Common Problems

**Problem**: "ENOTFOUND" or connection errors
- **Fix**: Check your internet connection and the API URL is correct.

**Problem**: "Rate limit exceeded" (429)
- **Fix**: Increase cache TTL or implement proper rate limit handling with backoff.

---

## 🎨 Lovable AI Prompt (UI Generation)

```text
Build an "API Integration Dashboard".

Frontend Requirements:
- A "Weather Search" page with a city input and "Fetch Weather" button.
- A loading state with animated spinner during API calls.
- A "Weather Card" showing:
    - City name
    - Temperature with large display
    - Wind speed and direction
    - Last updated timestamp
- An "Error State" showing:
    - Friendly error message (not raw technical errors)
    - "Retry" button
    - Suggestions (e.g., "Try a different city name")
- A "Request Log" panel showing:
    - Timestamp of each API call
    - Status (Success, Cached, Failed)
    - Response time
- A "Network Stats" section:
    - Total API calls made
    - Cache hits count
    - Average response time
- Integration: Fetch button calls POST /api/weather with body { "city": "..." }

Integration Specs (Mock for Lovable):
- POST /api/weather
- Request body: { "city": "London" }
- Response success: { "location": "...", "current": { "temperature": 15, ... } }
- Response error: { "error": true, "message": "...", "suggestion": "..." }

(Note: You are building the FRONTEND only. The API client logic, caching, retries, and validation will be handled via Windsurf.)
```

---

## 🛠️ Windsurf Integration Guide: Connecting UI to API Client

Once your "API Integration Dashboard" is ready, use **Windsurf** to power it with the `api-client.js` logic.

### 1. Export from Lovable
Open your downloaded Lovable project in **Windsurf**.

### 2. Connect the API Engine

Create an Express server that wraps your API client:

```javascript
const express = require('express');
const app = express();
app.use(express.json());

// Import your API client logic
const { getWeather } = require('./api-client');

app.post('/api/weather', async (req, res) => {
  const { city } = req.body;
  if (!city || typeof city !== 'string') {
    return res.status(400).json({ 
      error: true, 
      message: "City is required and must be a string",
      suggestion: "Please enter a valid city name like 'London' or 'Tokyo'."
    });
  }
  
  const result = await getWeather(city);
  const statusCode = result.error ? 502 : 200;
  res.status(statusCode).json(result);
});

app.listen(3000, () => console.log('API Integration Server running on http://localhost:3000'));
```

Frontend fetch example:
```javascript
const fetchWeather = async (city) => {
  const startTime = Date.now();
  const response = await fetch('http://localhost:3000/api/weather', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ city })
  });
  const data = await response.json();
  const responseTime = Date.now() - startTime;
  
  // Update UI with data and responseTime
  return { data, responseTime, status: response.status };
};
```

This creates a production-ready **API Integration Layer**!
