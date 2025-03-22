import express from 'express';
import { loadRestResources } from '../rest/loader.js';
import { mongodb } from '../repo/index.js'; // consistent import
import { MongoClient } from 'mongodb';

//test db
const client = new MongoClient('mongodb://localhost:27017');
const db = client.db('restify-dev');

//test app
const app = express();
app.use(express.json());

await loadRestResources({
  app,
  repoProvider: () => mongodb({ collection: db.collection('hobbies') }),
  baseDir: './dev/rest'
});

app.listen(3000, () => {
  console.log('Dev API running at http://localhost:3000/api');
});
