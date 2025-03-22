# @jarcher/restify

> A lightweight, pluggable REST API generator driven by schemas and backed by swappable data providers (in-memory, MySQL, MongoDB). Just drop in a schema and get a fully functional CRUD API — with zero boilerplate.

---

## ✨ Features

- ⚡ Instant REST APIs from `schema.json` files  
- 🧱 Pluggable data providers: memory, MySQL2, MongoDB  
- 🧪 Seed initial data with `seed.json`  
- 📁 Auto-load resources from `/rest` folder  
- ✅ Schema-based validation (supports nested objects and arrays)  
- 🧠 Functional, flat architecture (no OOP, no magic)  

---

## 📆 Installation

Install from your local Verdaccio or monorepo:

```bash
npm install @jarcher/restify
```

---

## 🚀 Quick Start

1. Create a `/rest` directory  
2. Add a schema for your resource  
3. (Optional) Add a seed file  
4. Wire it up with Express + a repo provider

---

## 📁 Example File Structure

```
rest/
└── hobbies/
    ├── schema.json
    └── seed.json
```

### `schema.json`

```json
{
  "required": true,
  "fields": {
    "id": { "type": "string", "required": true },
    "name": { "type": "string", "required": true },
    "category": { "type": "string" }
  }
}
```

### `seed.json`

```json
[
  { "id": "hobby-1", "name": "Hiking", "category": "Outdoors" },
  { "id": "hobby-2", "name": "Painting", "category": "Creative" }
]
```

---

## 🧠 Usage with Express

```js
import express from 'express';
import { loadRestResources, repoProviders } from '@jarcher/restify';

const app = express();
app.use(express.json());

await loadRestResources({
  app,
  baseDir: './rest',
  repoProvider: () => repoProviders.memory()
});

app.listen(3000, () => {
  console.log('API ready at http://localhost:3000/api');
});
```

---

## ⚙️ Switching Data Providers

### ✅ In-Memory

```js
repoProvider: () => repoProviders.memory()
```

No setup needed. Great for testing or prototyping.

---

### ✅ MongoDB

```js
import { MongoClient } from 'mongodb';

const client = new MongoClient('mongodb://localhost:27017');
await client.connect();
const db = client.db('myapp');

repoProvider: (resourceName) => repoProviders.mongodb({
  collection: db.collection(resourceName)
});
```

Each resource (e.g. `notes`, `tasks`) maps to a Mongo collection.

---

### ✅ MySQL2

```js
import mysql from 'mysql2/promise';

const pool = await mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'myapp'
});

repoProvider: (resourceName) => repoProviders.mysql2({
  pool,
  table: resourceName
});
```

Each resource corresponds to a table in the database.

---

## 📬 Routes Generated Per Resource

| Method | Path                | Description          |
|--------|---------------------|----------------------|
| GET    | `/api/:resource`    | List all items       |
| GET    | `/api/:resource/:id`| Get one item         |
| POST   | `/api/:resource`    | Create new item      |
| PUT    | `/api/:resource/:id`| Update an item       |
| DELETE | `/api/:resource/:id`| Delete an item       |

---

## 🔍 Validation

Each request body is validated against your `schema.json`. You'll get helpful errors:

```json
{
  "errors": [
    "root.name: Field is required",
    "root.completed: Expected type boolean, got string"
  ]
}
```

---

## 🧄 What’s Next?

- ✅ Support for `PATCH` (partial updates)  
- ✅ Hook system (`beforeCreate`, `afterDelete`, etc.)  
- 🧪 Relationship handling (populate nested data)  
- 📖 OpenAPI doc generation from schema  
- 🛠️ CLI: `restify init notes`, `restify seed`, etc.  

---

## 🧙 Example Project

Need an example to copy from? Check out the `dev/` folder inside this package for a working Express app using `restify`.

---

## 📝 License

MIT — by [@jarcher](https://your-site-or-gh-link.dev)

