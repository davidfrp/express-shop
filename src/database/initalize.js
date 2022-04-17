import db from './connect.js'
import bcrypt from 'bcrypt'

const deleteMode = true;

if (deleteMode) {
    db.exec(`DROP TABLE IF EXISTS users;`);
    db.exec(`DROP TABLE IF EXISTS addresses;`);
}

db.exec(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE
);`);

db.exec(`CREATE TABLE IF NOT EXISTS addresses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    street_name VARCHAR(255) NOT NULL,
    street_number INTEGER NOT NULL,
    premise VARCHAR(255) NOT NULL,
    city_name VARCHAR(255) NOT NULL,
    postal_code VARCHAR(255) NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id)
);`);

const users = [
    {
        username: 'heather',
        password: bcrypt.hashSync('12345678', 10),
        email: 'stephanie.hyam@bbc.co.uk'
    }
]

let sql = `INSERT INTO users (username, password, email) VALUES `;
sql += users.map(user => {
    return `('${user.username}', '${user.password}', '${user.email}'), `;
}).join(', ');

sql = sql.slice(0, -2);
db.exec(sql);

db.close();