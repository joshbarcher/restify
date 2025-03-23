export function createMySQLRepo({ pool, table }) {
    return {
        findAll: async ({
            query = '',
            filterField = 'title',
            findOne = false,
            page = 1,
            pageSize = 25
        } = {}) => {
            const whereClause = query ? `WHERE \`${filterField}\` LIKE ?` : '';
            const params = query ? [`%${query}%`] : [];

            if (findOne) {
                const [rows] = await connection.execute(
                    `SELECT * FROM \`${table}\` ${whereClause} LIMIT 1`,
                    params
                );
                return rows[0] || null;
            }

            const offset = (page - 1) * pageSize;

            const [results] = await connection.execute(
                `SELECT * FROM \`${table}\` ${whereClause} LIMIT ? OFFSET ?`,
                [...params, pageSize, offset]
            );

            const [countResult] = await connection.execute(
                `SELECT COUNT(*) as count FROM \`${table}\` ${whereClause}`,
                params
            );

            const total = countResult[0].count;

            return {
                results,
                page,
                pageSize,
                totalItems: total,
                totalPages: Math.ceil(total / pageSize)
            };
        },
        async findById(id) {
            const [rows] = await pool.query(`SELECT * FROM ?? WHERE id = ?`, [table, id]);
            return rows[0] || null;
        },
        async create(data) {
            const [result] = await pool.query(`INSERT INTO ?? SET ?`, [table, data]);
            const [rows] = await pool.query(`SELECT * FROM ?? WHERE id = ?`, [table, result.insertId]);
            return rows[0];
        },
        async update(id, data) {
            const [result] = await pool.query(`UPDATE ?? SET ? WHERE id = ?`, [table, data, id]);
            if (result.affectedRows === 0) return null;
            const [rows] = await pool.query(`SELECT * FROM ?? WHERE id = ?`, [table, id]);
            return rows[0];
        },
        async delete(id) {
            const [result] = await pool.query(`DELETE FROM ?? WHERE id = ?`, [table, id]);
            return result.affectedRows > 0;
        },
        async bulkCreate(dataArray) {
            const inserted = [];
            for (const data of dataArray) {
                const created = await this.create(data);
                inserted.push(created);
            }
            return inserted;
        },
        bulkDelete: async () => {
            await pool.query(`DELETE FROM ??`, [table]);
        }
    };
}
