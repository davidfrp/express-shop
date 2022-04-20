import db from '../database/connect.js';

export default (table, useSnakeCase = false) => {
    const toSnakeCase = (value) => value.replace(/[A-Z]/g, '_$&').toLowerCase();

    const splitToColumnsAndParams = (data) => {
        let columns = Object.keys(data);
            
        if (useSnakeCase) {
            columns = columns.map(toSnakeCase);
        }

        columns = columns.join(', ');

        const params = Object.values(data);

        return [columns, params];
    };

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
        /**
         * Finds and returns a single row from the table.
         * 
         * @param {*} filter An object containing the filter conditions
         * @param {*} columns An array of columns to select
         * @returns An object with the selected columns if found, undefined otherwise
         */
        findOne: async (filter, columns) => find(filter, columns, 1),
        /**
         * Finds and returns all matching rows from the table.
         * 
         * @param {*} filter An object containing the filter conditions
         * @param {*} columns An array of columns to select
         * @returns Array of objects with the selected columns if found, empty array otherwise
         */
        findAll: async (filter, columns) => find(filter, columns),
        /**
         * Inserts a new row into the table.
         * 
         * @param {*} data An object containing the data to insert
         * @returns The id of the inserted row
         */
        create: async (data) => {
            const [columns, params] = splitToColumnsAndParams(data);

            const values = '?'.repeat(params.length).split('').join(', ');

            const sql = `INSERT INTO ${table} (${columns}) VALUES (${values})`;
            
            return db.run(sql, params);
        },
        update: async (data) => {
            const [columns, params] = splitToColumnsAndParams(data);

            const values = columns
                .split(', ')
                .map((column) => `${column} = ?`)
                .join(', ');

            const sql = `UPDATE ${table} SET ${values} WHERE id = ?`;
            
            params.push(data.id);

            return db.run(sql, params);
        }
    };
};