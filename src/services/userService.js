import db from '../database/connect.js';
import authService from './authService.js';

export default {
    /**
     * Dangerously retrieves the first matching user from the database.
     * Includes thier hashed password, so it should only be used for authentication.
     * Consider using {@link findOne} for retrieving a user without their password hash.
     * 
     * @example 
     * await userService.findOneDangerously({ username: 'jane.doe' });
     * 
     * @param {*} query An object containing the keys and values to match.
     * @returns {Promise<*>} A promise that resolves to the user if found, or undefined if not.
     */
    findOneDangerously: async (query) => {
        let conditions = [];
        let params = [];
        
        for (const [key, value] of Object.entries(query)) {
            conditions.push(`${key} = ?`);
            params.push(value);
        }

        const sql = 'SELECT * FROM users WHERE ' + conditions.join(' AND ');
        
        const user = await db.get(sql, params);
        return user;
    },
    /**
     * Retrieves the first matching user from the database.
     * @example
     * await userService.findOne({ username: 'jane.doe' });
     * 
     * @param {*} query An object containing the keys and values to match.
     * @returns {Promise<*>} A promise that resolves to the user if found, or undefined if not.
     */
    findOne: async function(query) {
        const user = await this.findOneDangerously(query);
        delete user?.password;
        return user;
    },
    /**
     * Retrieves all users from the database.
     * @returns {Promise<*>} A promise that resolves to an array of users.
     */
    findAll: async function() {
        const sql = 'SELECT id, username, email FROM users';
        const users = await db.all(sql);
        return users;
    },
    /**
     * Creates a new user in the database.
     * @param {*} user An object containing the user's username, password, and email.
     * @returns {Promise<*>} A promise that resolves to the newly created user.
     * @throws An error if the user already exists.
     */
    create: async function(user) {
        const { username, password, email } = user;

        if (username === undefined || 
            password === undefined || 
            email === undefined) {
            throw new Error('400: Bad Request');
        }

        const isEmailAvailable = await this.findOne({ email }) === undefined;

        if (!isEmailAvailable)
            throw new Error('Email already registered', { cause: 'EMAIL_ALREADY_REGISTERED' });

        const isUsernameAvailable = await this.findOne({ username }) === undefined;

        if (!isUsernameAvailable)
            throw new Error('Username already taken', { cause: 'USERNAME_TAKEN' });
        
        const hashedPassword = await authService.hashPassword(password);

        return db.run(
            'INSERT INTO users (username, password, email) VALUES (?, ?, ?)', 
            [username, hashedPassword, email]
        );
    }
};