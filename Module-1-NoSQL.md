## Project: "Simple Student Database" (NoSQL - MongoDB)

Students will learn how to:

Set up MongoDB using Docker

Insert JSON documents

Query documents

Update documents

Delete documents

---

## Step 1: Start MongoDB Using Docker

```bash
docker run --name my-mongo \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password123 \
  -p 27017:27017 \
  -d mongo:6

# Verify
docker ps
```

---

## Step 2: Connect to MongoDB (mongosh)

```bash
docker exec -it my-mongo mongosh -u admin -p password123 --authenticationDatabase admin
```

---

## Step 3: Use a Database

```javascript
use school
```

---

## Step 4: Insert Data (CREATE)

```javascript
// Collection: students (created automatically when you insert)

db.students.insertOne({ name: "Deepa", age: 20, course: "Computer Science" })

db.students.insertMany([
  { name: "Karthik", age: 22, course: "Mathematics" },
  { name: "Priya", age: 21, course: "Physics" },
  { name: "Ravi", age: 23, course: "Chemistry" }
])
```

---

## Step 5: Read Data (READ)

```javascript
// Get all

db.students.find().pretty()

// Filter: age > 21

db.students.find({ age: { $gt: 21 } }).pretty()

// Only show name & course (projection)

db.students.find({}, { _id: 0, name: 1, course: 1 }).pretty()

// Sort by age

db.students.find().sort({ age: 1 }).pretty()

// Count

db.students.countDocuments()
```

---

## Step 6: Update Data (UPDATE)

```javascript
// Change Deepa's course to Data Science

db.students.updateOne(
  { name: "Deepa" },
  { $set: { course: "Data Science" } }
)

// Verify

db.students.find({ name: "Deepa" }).pretty()
```

---

## Step 7: Delete Data (DELETE)

```javascript
// Remove Ravi

db.students.deleteOne({ name: "Ravi" })

// Verify

db.students.find().pretty()
```

---

## Step 8: Exit and Cleanup

```bash
# Exit mongosh
exit

# Stop/start container
docker stop my-mongo
docker start my-mongo

# Remove container (deletes all data in it)
docker rm -f my-mongo
```

---

## 🧠 Key Concepts Summary

| Concept | What it means |
|---|---|
| **Document** | A JSON-like object (e.g., `{name, age, course}`) |
| **Collection** | Group of documents (similar to a table) |
| **Database** | Group of collections |
| **find()** | Read/query documents |
| **insertOne/insertMany** | Create documents |
| **updateOne + $set** | Update fields |
| **deleteOne** | Delete documents |

## 🔗 CRUD Operations

```
C - CREATE  → db.students.insertOne(...)
R - READ    → db.students.find(...)
U - UPDATE  → db.students.updateOne(...)
D - DELETE  → db.students.deleteOne(...)
```
