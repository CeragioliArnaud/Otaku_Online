const pool = require('../dbManager').pool;
const utils = require('../Utils/functionsUtils');
const logger = require('../Utils/logger').logger_dbManager;

module.exports = {

    insert_addProduct: (Manga, callback) => {


    },

    select_allCategories: (callback) => {
        (async () => {
            try {
                logger.info("Requête demandée : select_allCategories()");
                const result = await pool.query({ text: "SELECT name, description FROM categorie"});
                return (utils.isCallback(callback) ? callback(undefined, result.rows) : result.rows);
            } catch (e) {
                logger.error("Echec de la requête 'select_allCategories' : " + e.message)
                return (utils.isCallback(callback) ? callback(e) : e);
            }
        })().catch(e => {
            logger.error(e.message);
            return;
        });
    }
}