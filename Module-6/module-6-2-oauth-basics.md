# Module 6.2: OAuth 2.0 Basics (The Universal Passport)

### Why (in simple terms)
Imagine you want to enter a high-security building. Instead of creating a new ID card for that specific building, you show your **National Passport**. The security guard trusts the passport office, sees your photo, and lets you in. 

**OAuth** is the "Passport" of the internet. It lets you use your **GitHub, Google, or Discord** account to log into other apps without ever sharing your password with those apps.

### What you'll learn
1.  **The OAuth Flow**: How a user, an app, and a provider (like GitHub) talk to each other.
2.  **Client ID & Secret**: The "License Keys" for your application.
3.  **Redirect URIs**: Where the user goes after they say "Yes, I want to log in."
4.  **Access Tokens**: The temporary key given to your app to read user data.

---

## 🎨 Lovable AI Prompt (The OAuth Simulator)

*Copy and paste this into [Lovable.ai] to build a visual tool that explains the "Passport" handshake!*

```text
Build an "OAuth Flow Visualizer" using React and Tailwind CSS.

Requirements:
- Layout: Three columns: [The User] <-> [Your App] <-> [GitHub/Google].
- Interaction:
  - "Login with GitHub" button starts an animation of a "Request" moving to GitHub.
  - An "Authorize" button on the GitHub side sends a "Code" back to Your App.
  - Your App then sends that "Code" for an "Access Token".
  - Finally, a "Profile Card" appears showing the user's name and photo.
- Design: Clean, architectural style with dotted connecting lines and glowing data packets.

Make it look like a professional diagram that comes to life!
```

---

## 🏗️ The OAuth "Handshake" (Visual Analogy)

| Step | What happens? | The Analogy |
| :--- | :--- | :--- |
| **1. Request** | User clicks "Login with GitHub". | "I want to use my GitHub Passport." |
| **2. Consent** | GitHub asks: "Allow this app to see your email?" | "Do you permit this building to see your Passport?" |
| **3. Code** | GitHub sends a secret code to your app. | "Here is a temporary slip to give to the desk." |
| **4. Token** | Your app swaps the code for an Access Token. | "Trading the slip for a temporary building badge." |

---

## 🌊 Windsurf Practice: Setting up the Passport Office

### Step 1: Create the Project
1. Open **Windsurf** terminal and run:
   ```bash
   mkdir oauth-lab
   cd oauth-lab
   npm init -y
   npm install express passport passport-github2 dotenv express-session
   ```

### Step 2: Register your "Building" (App)
1. Go to **GitHub Settings** -> **Developer Settings** -> **OAuth Apps**.
2. Click **New OAuth App**.
3. Set **Authorization callback URL** to: `http://localhost:3000/auth/github/callback`.
4. Copy your **Client ID** and **Client Secret** into a `.env` file.

### Step 3: Implement the Handshake
Ask Windsurf: `"Create a server.js using 'passport' and 'passport-github2'. Use the Client ID and Secret from .env to implement a /auth/github route and a callback route that displays the user's GitHub username."`

#### 💡 Code Breakdown (The OAuth Secrets):
- **`passport.use()`**: This is where we tell our app: "If someone shows a GitHub passport, here is how you verify it."
- **`scope: ['user:email']`**: This is the "Permission Slip". We are only asking to see the user's email, not their private code!
- **`callbackURL`**: This is the "Return Address". After GitHub verifies the user, it sends them back here with the secret code.

---

## Quick practice tasks
- **Add Google Login**: Ask Windsurf: "How do I add Google Login using the `passport-google-oauth20` strategy?"
- **Profile Display**: Update your app to show the user's GitHub profile picture on the home page.
- **Log Out**: Implement a `/logout` route that clears the session and sends the user back to the login page.

---

## Checklist
- [ ] You can explain why OAuth is more secure than asking for passwords.
- [ ] You know where to find the Client ID and Secret on GitHub/Google.
- [ ] You understand that the "Callback URL" must match exactly in both the code and the provider settings.
- [ ] You have successfully displayed a user's name after a "Social Login."
