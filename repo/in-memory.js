export function createInMemoryRepo() {
    const store = new Map();

    const create = async (data) => {
        const id = crypto.randomUUID();
        const item = { ...data, id };
        store.set(id, item);
        return item;
    };

    return {
        findAll: async ({
            query = '',
            filterField = 'title',
            findOne = false,
            page = 1,
            pageSize = 25
        } = {}) => {
            let filtered = data;

            if (query) {
                const lower = query.toLowerCase();
                filtered = data.filter(item =>
                    (item[filterField] || '').toLowerCase().includes(lower)
                );
            }

            if (findOne) {
                return filtered[0] || null;
            }

            const total = filtered.length;
            const start = (page - 1) * pageSize;
            const paged = filtered.slice(start, start + pageSize);

            return {
                results: paged,
                page,
                pageSize,
                totalItems: total,
                totalPages: Math.ceil(total / pageSize)
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
