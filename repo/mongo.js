import { ObjectId } from 'mongodb';

export function createMongoRepo({ collection }) {
    return {
        findAll: async ({
            query = '',
            filterField = 'title',
            findOne = false,
            page = 1,
            pageSize = 25
        } = {}) => {
            const filter = query
                ? { [filterField]: { $regex: query, $options: 'i' } }
                : {};

            if (findOne) {
                const result = await collection.findOne(filter);
                return result ? withId(result) : null;
            }

            if (typeof pageSize !== 'number') {
                const docs = await collection.find(filter).toArray();
                return {
                    results: docs.map(withId),
                    totalPages: 1,
                    totalItems: docs.length
                };
            }

            const skip = (page - 1) * pageSize;

            const [results, total] = await Promise.all([
                collection.find(filter).skip(skip).limit(pageSize).toArray(),
                collection.countDocuments(filter)
            ]);

            return {
                results: results.map(withId),
                page,
                pageSize,
                totalItems: total,
                totalPages: Math.ceil(total / pageSize)
            };
        },
        async findById(id) {
            const doc = await collection.findOne({ _id: new ObjectId(id) });
            return doc ? withId(doc) : null;
        },
        async create(data) {
            const result = await collection.insertOne(data);
            const doc = await collection.findOne({ _id: result.insertedId });
            return withId(doc);
        },
        async update(id, data) {
            const _id = new ObjectId(id);
            const result = await collection.replaceOne({ _id }, data);
            if (result.matchedCount === 0) return null;
            return withId(await collection.findOne({ _id }));
        },
        async delete(id) {
            const result = await collection.deleteOne({ _id: new ObjectId(id) });
            return result.deletedCount > 0;
        },
        async bulkCreate(dataArray) {
            const result = await collection.insertMany(dataArray);
            const ids = Object.values(result.insertedIds);
            const docs = await collection.find({ _id: { $in: ids } }).toArray();
            return docs.map(withId);
        },
        bulkDelete: async () => {
            await collection.deleteMany({});
        }
    };
}

function withId(doc) {
    const { _id, ...rest } = doc;
    return { id: _id.toString(), ...rest };
}
