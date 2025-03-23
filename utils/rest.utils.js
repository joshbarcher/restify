import fs from 'fs/promises';
import path from 'path';
import { createCRUDRoutes } from './routes.utils.js';

export async function createEndpoints({ app, baseDir = './rest', repoProvider }) {
    const entries = await fs.readdir(baseDir, { withFileTypes: true });

    for (const entry of entries) {
        if (!entry.isDirectory()) continue;

        const name = entry.name;
        const schemaPath = path.join(baseDir, name, 'schema.json');
        const seedPath = path.join(baseDir, name, 'seed.json');

        const schema = JSON.parse(await fs.readFile(schemaPath, 'utf-8'));
        const repo = repoProvider(name);

        const router = createCRUDRoutes({ schema, repo, resource: name });
        app.use(`/api/${name}`, router);

        try {
            const seed = JSON.parse(await fs.readFile(seedPath, 'utf-8'));
            if (Array.isArray(seed) && repo.bulkCreate) {
                await repo.bulkCreate(seed);
                console.log(`Seeded ${name} (${seed.length})`);
            }
        } catch (err) {
            if (err.code !== 'ENOENT') throw err;
        }
    }
}
