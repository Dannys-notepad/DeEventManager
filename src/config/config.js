require('dotenv').config()
const DB = process.env.DB_NAME
const USERNAME = process.env.DB_USER
const PASSWORD = process.env.DB_PASS
const HOST = process.env.DB_HOST
const DIALECT = process.env.DB_DIALECT

module.exports =
{
  development: {
    username: 'root',
    password: 'root',
    database: 'deEventManager',
    host: 'localhost',
    dialect: 'mysql'
  },
  test: {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  production: {
    "username": "root",
    "password": null,
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}