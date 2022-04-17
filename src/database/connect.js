import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

export default await open({
  filename: 'database.db',
  driver: sqlite3.Database
});