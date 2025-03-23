import fs from 'fs/promises';
import path from 'path';
import { createCRUDRoutes } from './routes.utils.js';

export async function createEndpoints({ app, baseDir = './rest', repoProvider, forceSeed = false }) {
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
            const seedData = JSON.parse(await fs.readFile(seedPath, 'utf-8'));
            if (Array.isArray(seedData) && repo.bulkCreate) {
                const shouldSeed =
                    forceSeed ||
                    (typeof repo.findAll === 'function' && (await repo.findAll()).length === 0);

                if (shouldSeed) {
                    await repo.bulkCreate(seedData);
                    console.log(`Seeded ${name} (${seedData.length} items)`);
                } else {
                    console.log(`Skipped seed for ${name} (already has data)`);
                }
            }
        } catch (err) {
            if (err.code !== 'ENOENT') throw err;
        }
    }
}
