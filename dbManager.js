const { Pool } = require('pg');
const properties = require('./Utils/properties');
const logger = require('./Utils/logger').logger_dbManager;

const config = {
    host: properties.get('db.postgres.host'),
    port: properties.get('db.postgres.port'),
    database: properties.get('db.postgres.dbname'),
    user: properties.get('db.postgres.user'),
    password: properties.get('db.postgres.pwd')
};


const pool = new Pool(config);
pool.on('connect', () => { logger.debug(properties.get("console.LDAP.start")); })
pool.on('remove', () => { logger.debug(properties.get("console.LDAP.stop")); })

module.exports = pool;