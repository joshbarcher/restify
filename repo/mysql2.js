export function createMySQLRepo({ pool, table }) {
    return {
        async findAll({ page, pageSize, query = '' } = {}) {
            const filterClause = query ? 'WHERE title LIKE ?' : '';
            const filterValue = query ? [`%${query}%`] : [];
            const countQuery = `SELECT COUNT(*) as count FROM \`${table}\` ${filterClause}`;
            const [[{ count }]] = await pool.query(countQuery, filterValue);

            if (typeof pageSize !== 'number') {
                const [rows] = await pool.query(
                    `SELECT * FROM \`${table}\` ${filterClause}`,
                    filterValue
                );
                return {
                    results: rows,
                    totalPages: 1,
                    totalItems: rows.length
                };
            }

            const offset = (page - 1) * pageSize;
            const [rows] = await pool.query(
                `SELECT * FROM \`${table}\` ${filterClause} LIMIT ? OFFSET ?`,
                [...filterValue, pageSize, offset]
            );

            return {
                results: rows,
                totalPages: Math.ceil(count / pageSize),
                totalItems: count
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
