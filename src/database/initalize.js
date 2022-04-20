import db from './connect.js'
import bcrypt from 'bcrypt'

const deleteMode = true;

if (deleteMode) {
    db.exec(`DROP TABLE IF EXISTS users;`);
    db.exec(`DROP TABLE IF EXISTS products;`);
}

db.exec(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE
);`);

db.exec(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    price INTEGER NOT NULL
);`);

const products = [
    {
        name: 'Cooking spaghetti',
        description: 'Become a master of JavaScript programming.',
        price: 100
    },
    {
        name: 'Closure with a twist',
        description: 'How do they even function?',
        price: 40
    },
    {
        name: 'Garbage collection',
        description: '"The environment is a living thing."',
        price: 60
    }
]

let sql = `INSERT INTO products (name, description, price) VALUES `;
sql += products.map(product => {
    const { name, description, price } = product;
    return `('${name}', '${description}', '${price}')`;
}).join(', ');

db.exec(sql);

db.close();