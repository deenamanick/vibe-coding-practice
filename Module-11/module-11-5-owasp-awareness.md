## Practical 5: Basic OWASP Awareness (Web & CI/CD Security)

### Why (in simple terms)

In the world of web security, there is a global community called **OWASP** (Open Web Application Security Project). 

**The Double Threat**:
- **OWASP Top 10**: The most common risks *inside* your web application code.
- **OWASP CI/CD Top 10**: The most common risks *inside* your delivery pipeline (how your code gets to the server).

**The "Vibe Coding" Security Law**: Every app you build from today onwards must be "OWASP-Aware." Security isn't a feature; it's the foundation.

### 🛡️ Part 1: The Web Top 10 (Code Level)

Before your code even leaves your computer, it must be protected against:

| Risk Name | What it is | How to Fix |
| :--- | :--- | :--- |
| **1. Injection** | Hacker sends bad data to your server. | Use **Input Validation** (Module 11.4). |
| **2. Broken Auth** | Hacker steals sessions or weak passwords. | Use **Hashing** (Module 11.1). |
| **3. Data Exposure** | Secrets/Keys are visible. | Use **Env Variables** (Module 11.2). |

---

### ⛓️ Part 2: The CI/CD Top 10 (Pipeline Level)

This is about protecting the "Factory" that builds your code. If the factory is compromised, your app is doomed.

| Risk ID | Risk Name | The Danger |
| :--- | :--- | :--- |
| **CICD-1** | **Flow Control** | Code pushed without review/approvals. |
| **CICD-2** | **Identity/IAM** | Over-privileged accounts or stale tokens. |
| **CICD-3** | **Dependency Abuse** | Malicious packages (Typosquatting/Confusion). |
| **CICD-4** | **Poisoned Pipeline** | Attacker modifies `.github/workflows/main.yml`. |
| **CICD-5** | **Insufficient PBAC** | Low-privilege pipelines accessing production secrets. |
| **CICD-6** | **Credential Hygiene** | Secrets leaked in build logs or hardcoded. |
| **CICD-7** | **Insecure System Config** | Misconfigured SCM or CI tools (default admin pass). |
| **CICD-8** | **3rd Party Services** | Excessive permissions for external SaaS tools. |
| **CICD-9** | **Artifact Integrity** | Replacing a good build with a bad one. |
| **CICD-10** | **Logging & Visibility** | No audit trail for configuration or secret access. |

*Note: For beginners, focus on **CICD-1 (Approvals)**, **CICD-3 (Safe Dependencies)**, and **CICD-6 (Secret Management)**.*

---

### Your Security Checklist (The "Vibe Coding" Standard)

Before you launch any app, ask yourself these 5 questions:

1. **Passwords**: Are they hashed with `bcrypt`? (Never store plain text!)
2. **API Keys**: Are they in a `.env` file? (Is `.env` in your `.gitignore`?)
3. **URL**: Does it start with `https://`? (Is the padlock visible?)
4. **Input**: Am I validating user input before saving it? (Check for `<script>` tags!)
5. **Errors**: Am I showing "Technical Errors" to users? (Never show database errors to a user! Show "Something went wrong" instead.)

---

### ✅ Success Checklist

- [ ] You can name at least 3 OWASP risks.
- [ ] You understand: **Security is a process, not a one-time task.**
- [ ] You have a "Security First" mindset for your next project.

### 🆘 Common Problems

**Problem**: "Security is too hard/expensive"
- **Fix**: Most security tools (like `bcrypt`, `dotenv`, `helmet`) are **FREE** and take 5 minutes to set up.

**Problem**: "My app is too small to be hacked"
- **Fix**: Hackers use "Bots" that scan every website on the internet automatically. They don't care how small you are!

---

## 🎨 Lovable AI Prompt (UI Generation)

```text
Build a "Dual-Shield Security Audit" UI.

Frontend Requirements:
- A high-tech "Security Dashboard" with dark blue theme, glowing icons, and circular gauges.
- Two main sections: "Application Security" (Web) and "Pipeline Security" (CI/CD).
- Layout:
    - Left Shield: Application Risks (OWASP Top 10).
    - Right Shield: Pipeline Risks (CI/CD Top 10).
- Interaction: 
    - Checkboxes for each rule (e.g., CICD-1: Flow Control, CICD-6: Credential Hygiene).
    - As items are checked, the "Total Security Score" gauge animates from 0% to 100%.
- A "Vulnerability Map": A visual graph showing "Nodes" that turn from Red to Green as risks are mitigated.
- A "Log Viewer" at the bottom: Simulate a CI/CD build log that shows "Secret Scanning" or "Integrity Check" passes.
- Integration: Clicking "Generate Compliance Report" should call a POST /api/security/audit endpoint.

Integration Specs (Mock for Lovable):
- Expecting a POST /api/security/audit endpoint.
- Request body: { "webResolved": [1, 2], "cicdResolved": [1, 4, 6] }
- Response structure: { "report": "...", "score": 85, "grade": "Secure" }

(Note: You are building the FRONTEND only. The actual scoring logic and report generation will be handled via Windsurf.)
```

---

## 🛠️ Windsurf Integration Guide: Connecting UI to Security Auditing

Once your "Security Dashboard" UI is ready, use **Windsurf** to make it functional.

### 1. Export from Lovable
Open your downloaded Lovable project in **Windsurf**.

### 2. Connect the Auditing Engine
Update your frontend to talk to your local backend which handles security calculations:

```javascript
const handleAudit = async (checkedItems) => {
  const response = await fetch('http://localhost:3000/api/security/audit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items: checkedItems })
  });
  const data = await response.json();
  // Update your UI with the official security score and grade
};
```

This transforms your static checklist into a professional **Security Auditing Tool**!
