# Roleplay: Debugging & Refactoring with AI

**Scenario 1: The "Confident but Wrong" AI (Debugging)**
**Characters**: Alex (Product Manager) and Jeevi (Vibe Coder)
**Context**: A critical bug was found in the checkout process. The AI wrote the original code, and it's failing.

---

**Alex (PM)**: Jeevi! The checkout page is crashing when users try to apply a discount code. I thought the AI handled this?

**Jeevi (Vibe Coder)**: It did, but it "hallucinated" a bit. It used a function that doesn't exist in our version of the payment library. It looked perfectly correct, so I missed it during the first vibe.

**Alex**: So what now? Do we have to rewrite the whole thing?

**Jeevi**: No way. I'm using the **AI Debugging Cycle**. 
1.  **Isolate**: I showed the AI the exact error message from the logs. 
2.  **Verify**: I asked it *why* it chose that function. It realized the mistake immediately.
3.  **Fix**: I'm guiding it to use the correct library methods now.

**Alex**: So you're not just asking it to "fix it"?

**Jeevi**: Exactly. If I just say "fix it," it might make another guess. I’m giving it **context**—the library documentation and the error log. I’m the detective; the AI is the forensic lab.

---

**Scenario 2: Cleaning Up the "Spaghetti" (Refactoring)**
**Context**: The app is working, but the code is a mess. Alex is worried about future updates.

**Alex**: The feature is live, but the engineers from the other team said our code looks like "spaghetti." They're worried we can't maintain it.

**Jeevi**: They're right! When we were vibing fast to meet the deadline, we didn't worry about "clean code." But now that the pressure is off, I'm doing a **Refactoring Sprint**.

**Alex**: Won't that break the feature we just launched?

**Jeevi**: Not if I do it in **Chunks**. 
- I’m taking one small part of the code at a time.
- I ask the AI to "Refactor this for readability and performance without changing what it does."
- Then I run our tests to make sure it still works.

**Alex**: So you're using the AI to "tidy up" the house it just built?

**Jeevi**: Precisely. It’s like having a robot that can instantly reorganize your closet. It takes the mess we made while moving in and turns it into a professional, organized system. The other engineers will love it.

---

### 💡 Key Takeaways for Students:
- **Debugging**: Don't just ask for a "fix." Provide **Error Logs** and **Context**. Be the Detective.
- **Refactoring**: Use the AI to improve code quality *after* the feature works.
- **Chunking**: Never try to fix or clean everything at once. Small steps = zero crashes.
- **Verify**: Always test the AI's "fixes" before celebrating.
