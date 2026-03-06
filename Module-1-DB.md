## Project: "Simple Student Database"

Students will learn how to:

Set up a MySQL database using Docker

Create a simple table

Insert data into the table

Read (query) data from the table

---

## Step 1: Start MySQL Using Docker

```bash
# ============================================
# DOCKER — What is it?
# Docker lets you run software in a "container"
# Think of it like a mini computer inside your computer
# We use it here so you don't need to install MySQL manually
# ============================================

# This command does the following:
# docker run         → Start a new container
# --name my-mysql    → Give the container a name: "my-mysql"
# -e MYSQL_ROOT_PASSWORD=password123  → Set the root password (like an admin password)
# -e MYSQL_DATABASE=school            → Automatically create a database called "school"
# -p 3306:3306       → Make MySQL accessible on port 3306 (the default MySQL port)
# -d                 → Run in the background (detached mode)
# mysql:8.0          → Use MySQL version 8.0 image

docker run --name my-mysql \
  -e MYSQL_ROOT_PASSWORD=password123 \
  -e MYSQL_DATABASE=school \
  -p 3306:3306 \
  -d mysql:8.0
```

### Wait ~10 seconds for MySQL to start, then verify:

```bash
# Check if the container is running
# You should see "my-mysql" with status "Up"
docker ps
```

---

## Step 2: Connect to MySQL

```bash
# This command connects to MySQL running inside the Docker container
# docker exec    → Run a command inside a running container
# -it            → Interactive mode (so we can type commands)
# my-mysql       → Name of our container
# mysql -u root -p  → Start MySQL client as root user, -p means it will ask for password
# When prompted, type: password123

docker exec -it my-mysql mysql -u root -ppassword123
```

### You should now see the MySQL prompt:

```
mysql>
```

---

## Step 3: Select the Database

```sql
-- =============================================
-- SQL (Structured Query Language) — What is it?
-- SQL is the language used to talk to databases
-- You use SQL to CREATE tables, INSERT data, and READ data
-- =============================================

-- USE tells MySQL which database we want to work with
-- We created "school" when we started the Docker container
USE school;
```

---

## Step 4: Create a Table

```sql
-- =============================================
-- A TABLE is like a spreadsheet
-- It has COLUMNS (like headers) and ROWS (like entries)
-- =============================================

-- CREATE TABLE → makes a new table
-- "students" → the name of our table
-- Inside (...) we define the COLUMNS:

CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    -- id           → Column name
    -- INT          → Data type: a whole number (integer)
    -- AUTO_INCREMENT → The number increases automatically (1, 2, 3, ...)
    -- PRIMARY KEY  → This is the unique identifier for each row

    name VARCHAR(100) NOT NULL,
    -- name         → Column name
    -- VARCHAR(100) → Data type: text up to 100 characters
    -- NOT NULL     → This field CANNOT be left empty

    age INT NOT NULL,
    -- age          → Column name
    -- INT          → Data type: a whole number
    -- NOT NULL     → This field CANNOT be left empty

    course VARCHAR(100) NOT NULL
    -- course       → Column name
    -- VARCHAR(100) → Data type: text up to 100 characters
    -- NOT NULL     → This field CANNOT be left empty
);
```

### Your table structure now looks like this:

```
+--------+--------------+----------+
| Column | Type         | Notes    |
+--------+--------------+----------+
| id     | INT          | Auto, PK |
| name   | VARCHAR(100) | Required |
| age    | INT          | Required |
| course | VARCHAR(100) | Required |
+--------+--------------+----------+
```

---

## Step 5: Insert Data (Add Students)

```sql
-- INSERT INTO → adds a new row of data into a table
-- "students" → the table we're inserting into
-- (name, age, course) → the columns we're filling
-- VALUES (...) → the actual data

-- Add first student
INSERT INTO students (name, age, course) VALUES ('Deepa', 20, 'Computer Science');

-- Add second student
INSERT INTO students (name, age, course) VALUES ('Karthik', 22, 'Mathematics');

-- Add third student
INSERT INTO students (name, age, course) VALUES ('Priya', 21, 'Physics');

-- You can also add MULTIPLE students in one command:
INSERT INTO students (name, age, course) VALUES
    ('Ravi', 23, 'Chemistry'),
    ('Anitha', 19, 'Biology'),
    ('Suresh', 24, 'English');

-- Note: We don't provide "id" because it auto-increments automatically!
```

---

## Step 6: Read Data (Query the Table)

```sql
-- =============================================
-- SELECT is the most important SQL command
-- It is used to READ / RETRIEVE data from a table
-- =============================================

-- 6a: Get ALL data from the students table
-- * means "all columns"
SELECT * FROM students;

-- Expected output:
-- +----+---------+-----+------------------+
-- | id | name    | age | course           |
-- +----+---------+-----+------------------+
-- |  1 | Deepa   |  20 | Computer Science |
-- |  2 | Karthik |  22 | Mathematics      |
-- |  3 | Priya   |  21 | Physics          |
-- |  4 | Ravi    |  23 | Chemistry        |
-- |  5 | Anitha  |  19 | Biology          |
-- |  6 | Suresh  |  24 | English          |
-- +----+---------+-----+------------------+


-- 6b: Get only names and courses (specific columns)
SELECT name, course FROM students;


-- 6c: Get students who are older than 21
-- WHERE adds a condition (like a filter)
SELECT * FROM students WHERE age > 21;


-- 6d: Get a specific student by name
-- Use single quotes around text values
SELECT * FROM students WHERE name = 'Priya';


-- 6e: Count how many students are in the table
-- COUNT(*) counts the number of rows
SELECT COUNT(*) AS total_students FROM students;


-- 6f: Get students sorted by age (youngest first)
-- ORDER BY sorts the results
-- ASC = ascending (small to big), DESC = descending (big to small)
SELECT * FROM students ORDER BY age ASC;
```

---

## Step 7: Update Data (Change Existing Data)

```sql
-- UPDATE changes existing data in a row
-- SET defines what to change
-- WHERE specifies WHICH row to change (⚠️ NEVER forget WHERE!)

-- Change Deepa's course to "Data Science"
UPDATE students SET course = 'Data Science' WHERE name = 'Deepa';

-- Verify the change
SELECT * FROM students WHERE name = 'Deepa';
```

---

## Step 8: Delete Data (Remove a Row)

```sql
-- DELETE removes rows from a table
-- WHERE specifies WHICH row to delete
-- ⚠️ WARNING: Without WHERE, ALL rows will be deleted!

-- Remove the student named 'Suresh'
DELETE FROM students WHERE name = 'Suresh';

-- Verify: Suresh should no longer appear
SELECT * FROM students;
```

---

## Step 9: Exit and Cleanup

```bash
# Type 'exit' to leave the MySQL prompt
exit

# To STOP the MySQL container:
docker stop my-mysql

# To START it again later:
docker start my-mysql

# To REMOVE the container completely (deletes all data):
docker rm -f my-mysql
```

---

## 🧠 Key Concepts Summary

| Concept | What it means |
|---|---|
| **Docker** | Runs MySQL in a container (no manual install needed) |
| **Database** | A collection of tables (like a folder of spreadsheets) |
| **Table** | Stores data in rows and columns (like a spreadsheet) |
| **SQL** | The language used to talk to databases |
| **CREATE TABLE** | Makes a new table with defined columns |
| **INSERT INTO** | Adds new rows of data |
| **SELECT** | Reads/retrieves data from a table |
| **WHERE** | Filters results based on a condition |
| **UPDATE** | Changes existing data |
| **DELETE** | Removes data from a table |
| **PRIMARY KEY** | A unique identifier for each row (like a student ID) |
| **AUTO_INCREMENT** | Automatically assigns the next number (1, 2, 3...) |
| **VARCHAR(100)** | Text data type, up to 100 characters |
| **INT** | Integer (whole number) data type |
| **NOT NULL** | The field must have a value (cannot be empty) |

## 🔗 CRUD Operations

```
C - CREATE  →  INSERT INTO students ...
R - READ    →  SELECT * FROM students ...
U - UPDATE  →  UPDATE students SET ...
D - DELETE  →  DELETE FROM students ...
```

> 💡 Almost every app in the world (Facebook, Instagram, Amazon) uses these 4 operations!
