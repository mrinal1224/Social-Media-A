

---

# 🏆  Questions

---

## **Q1. Express Basics – Hello Route**

### Problem Statement

Create an Express server with a single route:

* `GET /hello` → returns

```json
{ "message": "Hello Express!" }
```

### Code Stub

```js
// src/hello.js
const express = require("express");
const app = express();

// Your code here

module.exports = app;
```

### Test Cases

* GET /hello → `{ "message": "Hello Express!" }`

### Final Solution

```js
const express = require("express");
const app = express();

app.get("/hello", (req, res) => {
  res.json({ message: "Hello Express!" });
});

module.exports = app;
```

---

## **Q2. Express & JSON – Greeting by Name**

### Problem Statement

Create a route:

* `POST /greet` that accepts a JSON body `{ "name": "Alice" }`
  and returns `{ "message": "Hello Alice!" }`.

### Code Stub

```js
// src/greet.js
const express = require("express");
const app = express();
app.use(express.json());

// Your code here

module.exports = app;
```

### Test Case

Input: `{ "name": "Bob" }` → `{ "message": "Hello Bob!" }`

### Final Solution

```js
app.post("/greet", (req, res) => {
  const { name } = req.body;
  res.json({ message: `Hello ${name}!` });
});
```

---

## **Q3. Query Params – Add Two Numbers**

### Problem Statement

Build an endpoint:

* `GET /add?a=3&b=5` → `{ "sum": 8 }`

### Code Stub

```js
// src/add.js
const express = require("express");
const app = express();

// Your code here

module.exports = app;
```

### Test Case

GET /add?a=10&b=20 → `{ "sum": 30 }`

### Final Solution

```js
app.get("/add", (req, res) => {
  const { a, b } = req.query;
  res.json({ sum: Number(a) + Number(b) });
});
```

---

## **Q4. Route Params – Welcome User**

### Problem Statement

Create `GET /welcome/:name`
→ returns `{ "message": "Welcome <name>!" }`

### Code Stub

```js
// src/params.js
const express = require("express");
const app = express();

// Your code here

module.exports = app;
```

### Test Case

GET /welcome/Alice → `{ "message": "Welcome Alice!" }`

### Final Solution

```js
app.get("/welcome/:name", (req, res) => {
  res.json({ message: `Welcome ${req.params.name}!` });
});
```

---

## **Q5. Basic Middleware – Time Logger**

### Problem Statement

Create a middleware that adds `req.time = new Date().toISOString()`
and use it for `/time` route returning `{ "time": "<timestamp>" }`

### Code Stub

```js
// src/time.js
const express = require("express");
const app = express();

// Middleware + Route here

module.exports = app;
```

### Test Case

GET /time → `{ "time": "<current ISO string>" }`

### Final Solution

```js
app.use((req, res, next) => {
  req.time = new Date().toISOString();
  next();
});

app.get("/time", (req, res) => {
  res.json({ time: req.time });
});
```

---

## **Q6. Error Handling – Division API**

### Problem Statement

Create `GET /divide?a=10&b=2` → `{ "result": 5 }`
If `b=0`, respond with status 400 and `{ "error": "Cannot divide by zero" }`.

### Code Stub

```js
// src/divide.js
const express = require("express");
const app = express();

// Your code here

module.exports = app;
```

### Test Cases

* `/divide?a=10&b=2` → `{ "result":5 }`
* `/divide?a=5&b=0` → 400 `{ "error":"Cannot divide by zero" }`

### Final Solution

```js
app.get("/divide", (req, res) => {
  const { a, b } = req.query;
  if (Number(b) === 0) return res.status(400).json({ error: "Cannot divide by zero" });
  res.json({ result: Number(a) / Number(b) });
});
```

---

## **Q7. Route Organization – Product Routes**

### Problem Statement

Create `/products` router:

* `GET /products/:id` → `{ "productId": "<id>" }`

### Code Stub

```js
// routes/productRoutes.js
const express = require("express");
const router = express.Router();
// Your code here

module.exports = router;

// src/app.js
const express = require("express");
const app = express();
const productRoutes = require("../routes/productRoutes");

// Your code here

module.exports = app;
```

### Test Case

GET /products/5 → `{ "productId":"5" }`

### Final Solution

```js
// productRoutes.js
router.get("/:id", (req, res) => {
  res.json({ productId: req.params.id });
});

// app.js
app.use("/products", productRoutes);
```

---

## **Q8. Chained Routes – Users CRUD (Read Only)**

### Problem Statement

Implement `/users`:

* `GET /users` → returns all users array.
* `GET /users/:id` → returns one user.
  Use dummy array `[ {id:1,name:"A"}, {id:2,name:"B"} ]`.

### Code Stub

```js
// src/users.js
const express = require("express");
const app = express();

// Your code here

module.exports = app;
```

### Test Case

GET /users/1 → `{ "id":1, "name":"A" }`

### Final Solution

```js
const users = [
  { id: 1, name: "A" },
  { id: 2, name: "B" },
];
app.get("/users", (req, res) => res.json(users));
app.get("/users/:id", (req, res) => {
  const user = users.find(u => u.id == req.params.id);
  res.json(user);
});
```

---

## **Q9. Environment Variables – Port from .env**

### Problem Statement

Use `dotenv` to load PORT from environment.
Start the server on that port and respond `{ "port": <PORT> }` at `/env`.

### Code Stub

```js
// src/envServer.js
require("dotenv").config();
const express = require("express");
const app = express();

// Your code here

module.exports = app;
```

### Test Case

If `.env` has `PORT=4000`, then `/env` → `{ "port":4000 }`

### Final Solution

```js
app.get("/env", (req, res) => {
  res.json({ port: process.env.PORT });
});
```

---

## **Q10. Static Files – Serve HTML**

### Problem Statement

Serve static files from `/public`.
A file `index.html` should open on `GET /`.

### Code Stub

```js
// src/staticServer.js
const express = require("express");
const path = require("path");
const app = express();

// Your code here

module.exports = app;
```

### Test Case

GET / → serves `index.html`

### Final Solution

```js
app.use(express.static(path.join(__dirname, "../public")));
```

---

## **Q11. Request Validation – Register User**

### Problem Statement

POST `/register` with body `{ username, password }`.
If missing any field, respond 400 `{ error: "All fields required" }`.

### Code Stub

```js
// src/register.js
const express = require("express");
const app = express();
app.use(express.json());

// Your code here

module.exports = app;
```

### Test Case

Input: `{ username:"a" }` → 400

### Final Solution

```js
app.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: "All fields required" });
  res.status(201).json({ username });
});
```

---

## **Q12. Async + DB Simulation – Fetch Posts**

### Problem Statement

`GET /posts` should simulate DB delay using `setTimeout` (2s) then return array `[1,2,3]`.

### Code Stub

```js
// src/posts.js
const express = require("express");
const app = express();

// Your code here

module.exports = app;
```

### Test Case

GET /posts → `[1,2,3]` (after 2s delay)

### Final Solution

```js
app.get("/posts", async (req, res) => {
  setTimeout(() => res.json([1, 2, 3]), 2000);
});
```

---

## **Q13. POST Validation – Todo Creation**

### Problem Statement

POST `/todos` → expects `{ title }`.
Return 201 with `{ id, title }` using incremental id.

### Code Stub

```js
// src/todos.js
const express = require("express");
const app = express();
app.use(express.json());

// Your code here

module.exports = app;
```

### Test Case

POST `{ "title":"Study" }` → `{ "id":1,"title":"Study" }`

### Final Solution

```js
let id = 1;
app.post("/todos", (req, res) => {
  const { title } = req.body;
  res.status(201).json({ id: id++, title });
});
```

---

## **Q14. PUT Route – Update Todo**

### Problem Statement

Extend `/todos/:id` (PUT) to update the title.

### Code Stub

```js
// src/todoUpdate.js
const express = require("express");
const app = express();
app.use(express.json());

let todos = [{ id: 1, title: "Old" }];

// Your code here

module.exports = app;
```

### Test Case

PUT `/todos/1` `{ "title":"New" }` → `{ "id":1,"title":"New" }`

### Final Solution

```js
app.put("/todos/:id", (req, res) => {
  const todo = todos.find(t => t.id == req.params.id);
  todo.title = req.body.title;
  res.json(todo);
});
```

---

## **Q15. DELETE Route – Remove Todo**

### Problem Statement

DELETE `/todos/:id` → remove from array and return remaining.

### Final Solution

```js
app.delete("/todos/:id", (req, res) => {
  todos = todos.filter(t => t.id != req.params.id);
  res.json(todos);
});
```

---

## **Q16. Advanced Middleware – Auth Token**

### Problem Statement

Write middleware `auth` that checks for header `x-api-key="12345"`.
If not present, respond 401 `{ error:"Unauthorized" }`.
Use for `/secure`.

### Code Stub

```js
// src/auth.js
const express = require("express");
const app = express();

// Middleware + Route

module.exports = app;
```

### Test Case

Without header → 401
With correct header → 200 `{ "message":"Access granted" }`

### Final Solution

```js
function auth(req, res, next) {
  if (req.headers["x-api-key"] !== "12345")
    return res.status(401).json({ error: "Unauthorized" });
  next();
}
app.get("/secure", auth, (req, res) => {
  res.json({ message: "Access granted" });
});
```

---

## **Q17. Async/Await – External Data Simulation**

### Problem Statement

Create async function `fetchData()` that returns `{ data:"ok" }` after 1s.
`GET /fetch` → await result and send it.

### Final Solution

```js
async function fetchData() {
  return new Promise(r => setTimeout(() => r({ data: "ok" }), 1000));
}
app.get("/fetch", async (req, res) => {
  const result = await fetchData();
  res.json(result);
});
```

---

## **Q18. Chained Middleware – Logger + Auth**

### Problem Statement

Two middlewares:

1. `logger` logs method
2. `auth` verifies `x-api-key`
   Apply both to `/admin`.

### Final Solution

```js
function logger(req, res, next) {
  console.log(req.method);
  next();
}
function auth(req, res, next) {
  if (req.headers["x-api-key"] !== "admin123")
    return res.status(401).json({ error: "No access" });
  next();
}
app.get("/admin", logger, auth, (req, res) => res.send("Admin OK"));
```

---

## **Q19. Mongoose Model – Comments**

### Problem Statement

Create `Comment` model `{ text:String, postId:String, author:String }`.
`POST /comments` saves it.

### Final Solution

```js
const mongoose = require("mongoose");
const commentSchema = new mongoose.Schema({
  text: String,
  postId: String,
  author: String,
});
const Comment = mongoose.model("Comment", commentSchema);

app.post("/comments", async (req, res) => {
  const c = new Comment(req.body);
  const saved = await c.save();
  res.status(201).json(saved);
});
```

---

## **Q20. Query Filters – Filter Posts by Author**

### Problem Statement

GET `/posts?author=Alice` → return only posts by Alice.

### Final Solution

```js
app.get("/posts", async (req, res) => {
  const author = req.query.author;
  const posts = await Post.find(author ? { author } : {});
  res.json(posts);
});
```

---

## **Q21. Aggregation – Post Count by Author**

### Problem Statement

GET `/stats` → returns `{ "Alice":2,"Bob":1 }` using Mongo aggregate.

### Final Solution

```js
app.get("/stats", async (req, res) => {
  const data = await Post.aggregate([
    { $group: { _id: "$author", count: { $sum: 1 } } },
  ]);
  const result = Object.fromEntries(data.map(d => [d._id, d.count]));
  res.json(result);
});
```

---

## **Q22. File Upload – Multer Setup**

### Problem Statement

Configure multer to accept single file upload at `/upload` and return file name.

### Final Solution

```js
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
app.post("/upload", upload.single("file"), (req, res) => {
  res.json({ filename: req.file.filename });
});
```

---

## **Q23. JWT Auth – Token Verification**

### Problem Statement

Implement `/login` → returns JWT if username=admin.
`GET /verify` → verifies JWT.

### Final Solution

```js
const jwt = require("jsonwebtoken");
const SECRET = "abc123";
app.post("/login", (req, res) => {
  if (req.body.username !== "admin")
    return res.status(401).json({ error: "Invalid" });
  const token = jwt.sign({ user: "admin" }, SECRET);
  res.json({ token });
});
app.get("/verify", (req, res) => {
  try {
    const data = jwt.verify(req.headers.authorization, SECRET);
    res.json(data);
  } catch {
    res.status(401).json({ error: "Bad token" });
  }
});
```

---

## **Q24. Async Error Handling – Global Catch**

### Problem Statement

Add global error middleware that catches thrown async errors and responds `{ error:"Something broke" }`.

### Final Solution

```js
app.use((err, req, res, next) => {
  res.status(500).json({ error: "Something broke" });
});
```

---

## **Q25. Caching Layer – In-Memory Cache**

### Problem Statement

Cache GET `/data` result for 10 seconds using in-memory variable before recomputing.

### Final Solution

```js
let cache = null, lastTime = 0;
app.get("/data", (req, res) => {
  const now = Date.now();
  if (cache && now - lastTime < 10000) return res.json(cache);
  cache = { time: new Date().toISOString() };
  lastTime = now;
  res.json(cache);
});
```

---

