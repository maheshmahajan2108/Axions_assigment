var config = require('./config.json');
const knex = require('knex')({
  client: 'mysql',
  connection: {
    host : 'localhost',
    port : 3306,
    user : 'admin',
    password : 'Virim@21',
    database : 'mysql'
  }
});

module.exports = knex;

