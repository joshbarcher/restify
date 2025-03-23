import express from 'express';
import { createEndpoints } from '../rest/scanner.js';
import { mongodb } from '../repo/index.js'; // consistent import
import { MongoClient } from 'mongodb';

//test db
const client = new MongoClient('mongodb://localhost:27017');
const db = client.db('test-restify');

//test app
const app = express();
app.use(express.json());

await createEndpoints({
    app,
    repoProvider: (resourceName) => mongodb({ collection: db.collection(resourceName) }),
    baseDir: './dev/rest'
});

app.listen(3000, () => {
    console.log('Dev API running at http://localhost:3000/api');
});
