export function createInMemoryRepo() {
    const store = new Map();

    const create = async (data) => {
        const id = crypto.randomUUID();
        const item = { ...data, id };
        store.set(id, item);
        return item;
    };

    return {
        async findAll({ page, pageSize, query = '' } = {}) {
            let items = Array.from(store.values());

            if (query) {
                const lowerQuery = query.toLowerCase();
                items = items.filter(item =>
                    (item.title || '').toLowerCase().includes(lowerQuery)
                );
            }

            if (typeof pageSize !== 'number') {
                return {
                    results: items,
                    totalPages: 1,
                    totalItems: items.length
                };
            }

            const totalItems = items.length;
            const start = (page - 1) * pageSize;
            const end = start + pageSize;
            const pagedItems = items.slice(start, end);

            return {
                results: pagedItems,
                totalPages: Math.ceil(totalItems / pageSize),
                totalItems
            };
        },
        async findById(id) {
            return store.get(id) || null;
        },
        create,
        async update(id, data) {
            if (!store.has(id)) return null;
            const item = { ...data, id };
            store.set(id, item);
            return item;
        },
        async delete(id) {
            return store.delete(id);
        },
        async bulkCreate(dataArray) {
            const result = [];
            for (const item of dataArray) {
                result.push(await create(item));
            }
            return result;
        },
        bulkDelete: async () => {
            store.clear();
        }
    };
}
