const { Client } = require('pg');
const properties = require('./Utils/properties');
const logger = require('./Utils/logger').logger_dbManager;

const config = {
    host: properties.get('db.postgres.host'),
    port: properties.get('db.postgres.port'),
    database: properties.get('db.postgres.dbname'),
    user: properties.get('db.postgres.user'),
    password: properties.get('db.postgres.pwd')
};

const client = new Client(config);
client.connect(err => {
    if (err) {
        logger.error(properties.get("console.db.start.KO") + "L'erreur suivante est survenue : " + err.message);
    } else {
        logger.info(properties.get("console.db.start"));
    }
});

module.exports = client;