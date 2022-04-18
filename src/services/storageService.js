import db from '../database/connect.js';

export default (table) => {
    const find = async (filter, columns, limit) => {
        let params = [];
        let conditions = [];
    
        columns = columns?.join(', ') ?? '*';
        
        for (const [key, value] of Object.entries(filter)) {
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
            const columns = Object.keys(data).join(', ');
            const params = Object.values(data);
            const values = '?'.repeat(params.length).split('').join(', ');

            const sql = `INSERT INTO ${table} (${columns}) VALUES (${values})`;
            
            return db.run(sql, params);
        }
    };
};

// export default {
//     /**
//      * Dangerously retrieves the first matching user from the database.
//      * Includes thier hashed password, so it should only be used for authentication.
//      * Consider using {@link findOne} for retrieving a user without their password hash.
//      * 
//      * @example 
//      * findOneDangerously({ username: 'jane.doe' });
//      * 
//      * findOneDangerously({ username: 'jane.doe' }, { username: 'john.doe' });
//      * 
//      * @param {*} partialUserObjs One or more objects containing the keys and values to match.
//      * @returns {Promise<*>} A promise that resolves to the user if found, or undefined if not.
//      */
//     findOneDangerously: async (...partialUserObjs) => {
//         let params = [];
//         let conditions = [];
//         for (const partialUserObj of partialUserObjs) {
//             console.log(partialUserObj);
//             for (const [key, value] of Object.entries(partialUserObj)) {
//                 conditions.push(`${key} = ?`);
//                 params.push(value);
//             }
//             console.log(conditions.join(' AND '));
//             // conditions = [conditions.join(' AND ')];
//         }
        
//         console.log('conditions', conditions);
//         const sql = 'SELECT * FROM users WHERE ' + conditions.join(' OR ');
        
//         console.log(sql, params);

//         const user = await db.get(sql, params);
//         return user;
//     },
//     /**
//      * Retrieves the first matching user from the database.
//      * @example
//      * await userService.findOne({ username: 'jane.doe' });
//      * 
//      * @param {*} query An object containing the keys and values to match.
//      * @returns {Promise<*>} A promise that resolves to the user if found, or undefined if not.
//      */
//     findOne: async function(query) {
//         const user = await this.findOneDangerously(query);
//         delete user?.password;
//         return user;
//     },
//     /**
//      * Retrieves all users from the database.
//      * @returns {Promise<*>} A promise that resolves to an array of users.
//      */
//     findAll: async function() {
//         const sql = 'SELECT id, username, email FROM users';
//         const users = await db.all(sql);
//         return users;
//     },
//     /**
//      * Creates a new user in the database.
//      * @param {*} user An object containing the user's username, password, and email.
//      * @returns {Promise<*>} A promise that resolves to the newly created user.
//      * @throws An error if the user already exists.
//      */
//     create: async function(user) {


//         return db.run(
//             'INSERT INTO users (username, password, email) VALUES (?, ?, ?)', 
//             [username, hashedPassword, email]
//         );
//     }
// };