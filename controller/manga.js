const pool = require('../dbManager').pool;
const utils = require('../Utils/functionsUtils');
const logger = require('../Utils/logger').logger_dbManager;

module.exports = {

    insert_addProduct: (Manga, callback) => {
        (async() => {
            try {
                logger.info("Requête demandée : insert_addProduct(" + Manga.title + Manga.reference + ")");
                await pool.query("BEGIN")
                const query = "INSERT INTO product (reference, title, volume_number, description, categorie, publish_date, price, publisher, mangaka) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id";
                const result = await pool.query(query, [Manga.reference, Manga.title, Manga.volumeNumber, Manga.description, Manga.categorie, Manga.publishDate, Manga.price, Manga.publisher, Manga.mangaka]);
                const query2 = "INSERT INTO product_genre VALUES($1, $2)"
                const result2 = await pool.query(query, [result.rows[0].id, Manga.genres]);
                await pool.query("COMMIT")
            } catch (e) {
                await pool.query("ROLLBACK")
                logger.error("Echec de la requête insert_addProduct(" + Manga.title + Manga.reference + ") : " + e.message)
                return (utils.isCallback(callback) ? callback(new Error("Une erreur est survenue, réessayez ulterieurement")) : new Error("Une erreur est survenue, réessayez ulterieurement"));
            }
        })()
    },

    select_allCategories: (callback) => {
        (async() => {
            try {
                logger.info("Requête demandée : select_allCategories()");
                const result = await pool.query({ text: "SELECT name, description FROM categorie" });
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