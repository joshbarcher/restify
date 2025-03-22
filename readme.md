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
├── hobbies/
│   ├── schema.json
│   └── seed.json
├── tasks/
│   ├── schema.json
│   └── seed.json
└── users/
    ├── schema.json
    └── seed.json
```

### `hobbies/schema.json`

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

### `hobbies/seed.json`

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
import express from 'express';
import { MongoClient } from 'mongodb';
import { loadRestResources, repoProviders } from '@jarcher/restify';

const client = new MongoClient('mongodb://localhost:27017');
await client.connect();
const db = client.db('myapp');

const app = express();
app.use(express.json());

await loadRestResources({
  app,
  baseDir: './rest',
  repoProvider: (resourceName) => repoProviders.mongodb({
    collection: db.collection(resourceName)
  })
});

app.listen(3000, () => {
  console.log('API ready at http://localhost:3000/api');
});
```

Each resource folder (e.g. `notes`, `tasks`) is mapped to a MongoDB collection of the same name.

---

### ✅ MySQL2

```js
import express from 'express';
import mysql from 'mysql2/promise';
import { loadRestResources, repoProviders } from '@jarcher/restify';

const pool = await mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'myapp'
});

const app = express();
app.use(express.json());

await loadRestResources({
  app,
  baseDir: './rest',
  repoProvider: (resourceName) => repoProviders.mysql2({
    pool,
    table: resourceName
  })
});

app.listen(3000, () => {
  console.log('API ready at http://localhost:3000/api');
});
```

Each resource folder (e.g. `notes`, `tasks`) is mapped to a MySQL table of the same name.

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

AGPL-3.0-only — by [@jarcher](https://github.com/joshbarcher)

