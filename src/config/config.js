const env = require('./env')

module.exports =
{
  development: {
    username: env.USERNAME,
    password: env.PASSWORD,
    database: env.DB,
    host: env.HOST,
    dialect: env.DIALECT
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