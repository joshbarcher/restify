export function createMySQLRepo({ pool, table }) {
    return {
        async findAll() {
            const [rows] = await pool.query(`SELECT * FROM ??`, [table]);
            return rows;
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
