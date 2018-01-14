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

module.exports = {
    
    start: () => {
        pool.connect((err) => {
            if (err) {
                logger.error(properties.get("db.start.KO") + "\nL'erreur suivante est survenue : " + err.message);
            } else {
                logger.info(properties.get("db.start"));
            }
        });
    },

    pool: pool,

    stop: () => {
        try {
            pool.end();
            logger.info(properties.get("db.stop"));
        } catch (e) {
            logger.error("stop() - Error : " + e.message);
        }
    }
}