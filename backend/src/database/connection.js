const knex = require('knex');
const config = require('../../knexfile');

const environment = process.env.NODE_ENV || 'development';
const connection = knex(config[environment]);

module.exports = connection;