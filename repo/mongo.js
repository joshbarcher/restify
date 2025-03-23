import { ObjectId } from 'mongodb';

export function createMongoRepo({ collection }) {
    return {
        async findAll({ page, pageSize, query = '' } = {}) {
            const filter = query
                ? { title: { $regex: query, $options: 'i' } }
                : {};

            if (typeof pageSize !== 'number') {
                const docs = await collection.find(filter).toArray();
                return {
                    results: docs.map(withId),
                    totalPages: 1,
                    totalItems: docs.length
                };
            }

            const skip = (page - 1) * pageSize;
            const docs = await collection.find(filter).skip(skip).limit(pageSize).toArray();
            const total = await collection.countDocuments(filter);

            return {
                results: docs.map(withId),
                totalPages: Math.ceil(total / pageSize),
                totalItems: total
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
