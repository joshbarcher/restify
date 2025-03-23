// cli/create-rest.js
import fs from 'fs/promises';
import path from 'path';

const defaultSchema = {
    required: true,
    fields: {
        id: { type: "string", required: true },
        name: { type: "string", required: true }
    }
};

const defaultSeed = [
    { id: "item-1", name: "Sample 1" },
    { id: "item-2", name: "Sample 2" }
];

export async function createRest(resources = []) {
    const restDir = path.resolve(process.cwd(), 'rest');
    await fs.mkdir(restDir, { recursive: true });

    for (const name of resources) {
        const resourcePath = path.join(restDir, name);
        await fs.mkdir(resourcePath, { recursive: true });

        const schemaPath = path.join(resourcePath, 'schema.json');
        const seedPath = path.join(resourcePath, 'seed.json');

        await fs.writeFile(schemaPath, JSON.stringify(defaultSchema, null, 2));
        await fs.writeFile(seedPath, JSON.stringify(defaultSeed, null, 2));
        console.log(`✅ Created /rest/${name}/`);
    }
}
