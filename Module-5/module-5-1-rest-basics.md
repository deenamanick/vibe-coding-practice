# Module 5.1: REST API Basics (The App's Menu)

### Why (in simple terms)
If a database is a **pantry** full of food, and the user is a **customer** at a table, then the **REST API** is the **waiter** and the **menu**. It provides a standard, predictable way for the frontend to ask for exactly what it needs without going into the kitchen itself.

### What you'll learn
1.  **Resources**: Thinking of data as "things" (e.g., `/notes`, `/users`).
2.  **Verbs (Methods)**: How to ask the waiter to "Bring", "Add", "Change", or "Remove".
3.  **Status Codes**: The waiter's quick response (200 = "Here you go!", 404 = "We're out of that").
4.  **JSON**: The universal language used to exchange data.

---

## 🎨 Lovable AI Prompt (The REST Explorer)

*Copy and paste this into [Lovable.ai] to build a visual tool that simulates how REST works!*

```text
Build a "REST API Visualizer" using React and Tailwind CSS.

Requirements:
- Layout: A vertical split screen. Top is the "Client" (Frontend), Bottom is the "Server" (Backend).
- Features:
  - An animated "Data Packet" that moves between Client and Server when a button is clicked.
  - Buttons for different Methods: GET, POST, PUT, PATCH, DELETE.
  - A "Status Code" display that changes based on the method (e.g., POST shows 201 Created).
  - A JSON preview window showing the data being sent/received.
- Design: Modern, clean, with "circuit board" style connecting lines and glowing status indicators.

Make it look like a high-tech lab for testing data flows!
```

---

## 🏗️ The Method Cheat Sheet (POST vs PUT vs PATCH)

Students often get confused here. Here is the "House Renovation" analogy:

| Method | Analogy | Technical Term |
| :--- | :--- | :--- |
| **POST** | **Building a new house** on an empty lot. | Create |
| **PUT** | **Replacing the entire house** with a brand new one. | Update (Full) |
| **PATCH** | **Fixing a broken window** or painting one wall. | Update (Partial) |
| **GET** | **Looking at the house** through a telescope. | Read |
| **DELETE** | **Tearing down the house.** | Delete |

---

## 🔬 Beyond REST: GraphQL & gRPC

While REST is the most common, you will hear about these in advanced projects:

### 1. GraphQL (The "Custom Order")
*   **When it comes**: When your app is huge (like Facebook) and you only want *specific* pieces of data (e.g., "just the user's name, not their whole profile").
*   **Analogy**: Instead of a set menu, you give the waiter a specific list of ingredients you want on your plate.
*   **Example Query**:
    ```graphql
    query {
      user(id: "123") {
        name
        email
        # Only getting what we need, nothing more!
      }
    }
    ```

### 2. gRPC (The "High-Speed Rail")
*   **When it comes**: When two servers need to talk to each other *insanely fast* (Microservices).
*   **Analogy**: A private, high-speed pneumatic tube between two buildings. It's much faster than a waiter walking, but harder to set up.
*   **Example (.proto file)**:
    ```protobuf
    service NoteService {
      rpc GetNote (NoteRequest) returns (NoteResponse) {}
    }
    
    message NoteRequest {
      string id = 1;
    }
    ```

---

## 🌊 Windsurf Practice: Designing the "Notes" API

### Step 1: The Design Prompt
Ask Windsurf: 
```text
ROLE: Backend Architect.
TASK: Propose a RESTful URL structure for a "Notes" application.
CONTEXT: We need to handle:
- Listing all notes
- Creating a new note
- Updating a note's title
- Deleting a note
OUTPUT: A Markdown table showing the Method, URL, and expected Status Code.
```

#### 💡 Code Breakdown (Why REST is standard):
- **Predictability**: Notice how every URL starts with `/notes`. This makes it easy for other developers to understand your API without reading 100 pages of documentation.

---

## Quick practice tasks
- **Status Code Match**: If a user tries to GET a note that doesn't exist, which status code should you return? (Hint: 404).
- **Patch vs Put**: If I only want to change the `isCompleted` status of a task, should I use PUT or PATCH?
- **Resource Naming**: If you were building an API for a library, what would be the resource name for books? (Hint: `/books`).

---

## Checklist
- [ ] You can explain the "Waiter" analogy for REST APIs.
- [ ] You know the difference between POST, PUT, and PATCH.
- [ ] You understand that 200 means success and 404 means not found.
- [ ] You have designed a basic URL structure for a new resource.
