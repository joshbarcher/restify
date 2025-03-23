import express from 'express';
import { validate } from './validation.utils.js';
import { validateRepository } from './repo.utils.js';

export function createCRUDRoutes({ schema, repo, resource = 'resource' }) {
    validateRepository(repo);

    const router = express.Router();

    router.get('/', async (req, res) => {
        const page = req.query.page ? parseInt(req.query.page, 10) : undefined;
        const pageSize = req.query.pageSize ? parseInt(req.query.pageSize, 10) : undefined;
        const query = req.query.query || '';

        try {
            const result = await repo.findAll({ page, pageSize, query });

            res.json({
                [resource]: result.results,
                totalItems: result.totalItems,
                totalPages: result.totalPages
            });
        } catch (err) {
            res.status(500).json({ error: `Failed to fetch ${resource} list.` });
        }
    });

    router.get('/:id', async (req, res) => {
        const item = await repo.findById(req.params.id);
        if (!item) return res.status(404).json({ error: `${resource} not found` });
        res.json(item);
    });

    router.post('/', async (req, res) => {
        const errors = validate(schema, req.body);
        if (errors.length) return res.status(400).json({ errors });
        const created = await repo.create(req.body);
        res.status(201).json(created);
    });

    router.put('/:id', async (req, res) => {
        const errors = validate(schema, req.body);
        if (errors.length) return res.status(400).json({ errors });
        const updated = await repo.update(req.params.id, req.body);
        if (!updated) return res.status(404).json({ error: `${resource} not found` });
        res.json(updated);
    });

    router.delete('/:id', async (req, res) => {
        const deleted = await repo.delete(req.params.id);
        if (!deleted) return res.status(404).json({ error: `${resource} not found` });
        res.status(204).end();
    });

    return router;
}
