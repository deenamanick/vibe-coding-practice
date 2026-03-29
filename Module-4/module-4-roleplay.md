# Roleplay: Fixing Mistakes & Tying Up Code with AI

**Scenario 1: The "Confident but Wrong" AI (Debugging)**
**Characters**: Alex (Product Manager) and Jeevi (Vibe Coder)
**Context**: A small button on the website isn't working. The AI wrote the code, but it's "broken."

---

**Alex (PM)**: Jeevi! The "Apply Discount" button isn't doing anything. I thought the AI built this perfectly?

**Jeevi (Vibe Coder)**: It did build it fast, but it made a small "typo" in the logic. It's like a professional chef who forgot to add salt—the dish looks great, but it doesn't taste right!

**Alex**: Do we have to start over?

**Jeevi**: Not at all! I’m being a **Code Detective**. 
1.  **Find the Clue**: I looked at the error message (it said "Cannot find variable: discount").
2.  **Tell the AI**: I didn't just say "fix it." I told the AI, "Hey, you forgot to define the 'discount' variable here."
3.  **The Fix**: The AI saw the mistake and fixed it in 2 seconds.

**Alex**: So you just have to point out the specific mistake?

**Jeevi**: Exactly. If you just say "it's broken," the AI might guess. If you give it a "clue" (the error message), it fixes it perfectly.

### 📝 **Example: The "Simple Clue" Debugging Prompt**
*Instead of saying "Fix this," Jeevi says:*

> "The button isn't working. The error log says: `ReferenceError: discount is not defined`. Can you find where you forgot to create the 'discount' variable and fix it?"

---

**Scenario 2: Making Messy Code "Pretty" (Refactoring)**
**Context**: The code works, but it's hard to read. It's like a messy room that needs tidying.

**Alex**: The button works now! But our other developer says the code is "messy" and hard to understand.

**Jeevi**: She's right. When we were rushing, we just threw everything into one big pile. Now, I'm going to **Tidy Up** (Refactor).

**Alex**: Will "tidying up" break the button again?

**Jeevi**: Not if I do it **one drawer at a time** (Chunking). 
- I’m not cleaning the whole house at once. 
- I’m asking the AI to "Take this one section and make it look professional and easy to read."
- I check the button after every small change to make sure it still works.

**Alex**: So it’s like moving from a messy pile of clothes to a neatly organized closet?

**Jeevi**: Precisely! The code does the exact same thing, but now any other human can read it and understand it. 

### 📝 **Example: The "Tidy Up" Prompt**
*Jeevi gives the AI a small "pile" of code and says:*

> "This code is a bit messy. Can you:
> 1. Use simpler names for the variables (like `totalPrice` instead of `tp`).
> 2. Add a few comments explaining what each part does.
> 3. Make it look neat and professional."

---

### 💡 Key Takeaways for Students:
- **Debugging**: Be a **Detective**. Give the AI "clues" (error messages).
- **Refactoring**: Be a **Tidier**. Make the code easy for humans to read.
- **One Step at a Time**: Never fix or clean everything at once. Small steps = zero crashes.
