const pool = require('../dbManager').pool;
const utils = require('../Utils/functionsUtils');
const Manga = require('../Model/Manga');
const logger = require('../Utils/logger').logger_dbManager;

module.exports = {

    insert_addProduct: (Manga, callback) => {
        //TODO
    },

    select_mangaById: (id, callback) => {
        (async () => {
            try {
                logger.info("Requête demandée : select_mangaById(" + id + ")");
                const query =   "SELECT p.id, p.reference, p.title, p.volume_number, p.description, p.publish_date, p.price, p.nb_sales, " +
                                "c.name as categorie, pu.name as publisher_name, m.first_name as mangaka_first_name, m.last_name as mangaka_last_name, ( " +
                                    "SELECT array_to_string(array_agg(DISTINCT g.name), ',') as genres " + 
                                    "FROM genre g INNER JOIN product_genre pg on(g.id = pg.genre_id) " +
                                    "WHERE pg.product_id = $1) " +
                                "FROM product p " +
                                "INNER JOIN categorie c on(p.categorie = c.id) " +
                                "INNER JOIN publisher pu on(p.publisher = pu.id) " +
                                "INNER JOIN mangaka m on(p.mangaka = m.id) " +
                                "WHERE p.id = $1";
                const result = await pool.query();
                if(result.rowCount == 0) {
                    return (utils.isCallback(callback) ? callback(new Error("L'id du produit n'a pas été trouvé")) : new Error("L'id du produit n'a pas été trouvé"));
                } else {
                    var line = result.rows[0];
                    var manga = new Manga(line.reference, line.title, line.volume_number, line.description, line.categorie, line.publish_date, line.price, line.publisher, line.mangaka_last_name + " " + line.mangaka_first_name, lines.genres);
                    manga.id = line.id;
                    Object.freeze(manga);
                    return (utils.isCallback(callback) ? callback(undefined, manga) : manga);
                }
            } catch (e) {
                logger.error("Echec de la requête 'select_allCategories' : " + e.message)
                return (utils.isCallback(callback) ? callback(new Error("Une erreur est survenue, réessayez ulterieurement")) : new Error("Une erreur est survenue, réessayez ulterieurement"));
            }
        })().catch(e => {
            logger.error(e.message);
            return;
        });
    },

    select_allCategories: (callback) => {
        (async () => {
            try {
                logger.info("Requête demandée : select_allCategories()");
                const result = await pool.query("SELECT name, description FROM categorie");
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