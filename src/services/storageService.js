import db from '../database/connect.js';

export default (table, useSnakeCase = true) => {
    const toSnakeCase = (value) => value.replace(/[A-Z]/g, '_$&').toLowerCase();

    const find = async (filter, columns, limit) => {
        let params = [];
        let conditions = [];

        if (useSnakeCase) {
            columns = columns?.map(toSnakeCase);
        }
    
        columns = columns?.join(', ') ?? '*';
        
        for (let [key, value] of Object.entries(filter)) {
            if (useSnakeCase) {
                key = toSnakeCase(key);
            }
            conditions.push(`${key} = ?`);
            params.push(value);
        }

        limit = limit ? ` LIMIT ${limit}` : '';
        conditions = conditions.length > 0 ? ` WHERE ${conditions.join(' AND ')}` : '';
    
        const sql = `SELECT ${columns} FROM ${table}${conditions}${limit}`;

        if (limit === ' LIMIT 1')
            return db.get(sql, params);
        
        return db.all(sql, params);
    };

    return {
        findOne: async (filter, columns) => find(filter, columns, 1),
        findAll: async (filter, columns) => find(filter, columns),
        create: async (data) => {
            let columns = Object.keys(data);
            
            if (useSnakeCase) {
                columns = columns.map(toSnakeCase);
            }

            columns = columns.join(', ');

            const params = Object.values(data);
            const values = '?'.repeat(params.length).split('').join(', ');

            const sql = `INSERT INTO ${table} (${columns}) VALUES (${values})`;
            
            return db.run(sql, params);
        }
    };
};