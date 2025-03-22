export function createInMemoryRepo() {
    const store = new Map();

    const create = async (data) => {
        const id = crypto.randomUUID();
        const item = { ...data, id };
        store.set(id, item);
        return item;
    };

    return {
        async findAll() {
            return [...store.values()];
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
        }
    };
}
