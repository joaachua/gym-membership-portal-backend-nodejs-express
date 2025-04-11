const knex = require('knex');
const knexfile = require('./knexfile');

const db = knex(knexfile.localhost);

module.exports = db;