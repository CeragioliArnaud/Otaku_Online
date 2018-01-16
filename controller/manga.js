const pool = require('../dbManager').pool;
const utils = require('../Utils/functionsUtils');
const Manga = require('../Model/Manga');
const logger = require('../Utils/logger').logger_dbManager;

module.exports = {

    update_modifyProduct: (manga, callback) => {
        (async () => {
            try {
                logger.info("Requête demandée : update_modifyProduct(" + manga.id + ")");
                await pool.query("BEGIN");
                var i = 0;
                var parameters = [];
                var query = "UPDATE product SET ";
                if (utils.isNullOrBlank(manga.id) || isNaN(manga.id)) {
                    throw new Error("Contenu incorrect");
                }
                if (!utils.isNullOrBlank(manga.reference)) { query += "reference = $" + i++ + ","; parameters.push(manga.reference); }
                if (!utils.isNullOrBlank(manga.title)) { query += "title = $" + i++ + ","; parameters.push(manga.title); }
                if (!utils.isNullOrBlank(manga.volume_number)) {
                    if(isNaN(manga.volume_number)) {
                        throw new Error("Contenu incorrect");
                    }
                    query += "volume_number = $" + i++ + ",";
                    parameters.push(parseInt(manga.volume_number));
                }
                if (!utils.isNullOrBlank(manga.description)) { query += "description = $" + i++ + ","; parameters.push(manga.description); }
                if (!utils.isNullOrBlank(manga.categorie)) {
                    if(isNaN(manga.categorie)) {
                        query += "(SELECT id FROM categorie WHERE name=$" + i++ + "),";
                    } else {
                        query += "categorie = $" + i++ + ",";
                    }
                    parameters.push(manga.categorie);
                }
                if (!utils.isNullOrBlank(manga.publish_date)) { query += "publish_date = $" + i++ + ","; parameters.push(manga.publish_date); }
                if (!utils.isNullOrBlank(manga.price)) {
                    if(isNaN(manga.price)) {
                        throw new Error("Contenu incorrect");
                    }
                    query += "price = $" + i++ + ",";
                    parameters.push(manga.price);
                }
                if (!utils.isNullOrBlank(manga.mangaka)) {
                    if(isNaN(manga.mangaka)) {
                        query += "(SELECT id FROM mangaka WHERE concat(first_name, ' ', last_name)=$" + i++ + "),";
                        parameters.push('%' + manga.mangaka + '%');
                    } else {
                        query += "mangaka = $" + i++ + ",";
                        parameters.push(manga.mangaka);
                    }
                }
                if (!utils.isNullOrBlank(manga.images)) { query += "images = $" + i++ + ","; parameters.push(manga.images); }

                query = query.substring(0, query.length - 1);
                query += " WHERE id=$" + i++;
                parameters.push(manga.id);
                const result = await pool.query(query, parameters);
                if(result.rowCount != 1) {
                    throw new Error(result.rowCount + " lignes ont été affectées");
                }
                await pool.query("COMMIT");
                return (utils.isCallback(callback) ? callback(undefined, result.rows) : result.rows);
            } catch (e) {
                await pool.query("ROLLBACK");
                logger.error("Echec de la requête 'update_modifyProduct' : " + e.message)
                return (utils.isCallback(callback) ? callback(e) : e);
            }
        })();
    },

    select_mangaById: (id, callback) => {
        (async () => {
            try {
                logger.info("Requête demandée : select_mangaById(" + id + ")");
                const query = "SELECT p.id, p.reference, p.title, p.volume_number, p.description, p.publish_date, p.price, p.nb_sales, " +
                    "c.name as categorie, pu.name as publisher_name, m.first_name as mangaka_first_name, m.last_name as mangaka_last_name, ( " +
                    "SELECT array_to_string(array_agg(DISTINCT g.name), ',') as genres " +
                    "FROM genre g INNER JOIN product_genre pg on(g.id = pg.genre_id) " +
                    "WHERE pg.product_id = $1), " +
                    "p.images " +
                    "FROM product p " +
                    "INNER JOIN categorie c on(p.categorie = c.id) " +
                    "INNER JOIN publisher pu on(p.publisher = pu.id) " +
                    "INNER JOIN mangaka m on(p.mangaka = m.id) " +
                    "WHERE p.id = $1";
                const result = await pool.query(query, [id]);
                if (result.rowCount == 0) {
                    return (utils.isCallback(callback) ? callback(new Error("L'id du produit n'a pas été trouvé")) : new Error("L'id du produit n'a pas été trouvé"));
                } else {
                    var line = result.rows[0];
                    var manga = new Manga(line.id, line.reference, line.title, line.volume_number, line.description, line.categorie, line.publish_date, line.price, line.publisher, line.mangaka_last_name + " " + line.mangaka_first_name, line.genres, line.images);
                    Object.freeze(manga);
                    return (utils.isCallback(callback) ? callback(undefined, manga) : manga);
                }
            } catch (e) {
                logger.error("Echec de la requête 'select_allCategories' : " + e.message)
                return (utils.isCallback(callback) ? callback(new Error("Une erreur est survenue, réessayez ulterieurement")) : new Error("Une erreur est survenue, réessayez ulterieurement"));
            }
        })();
    },

    select_allCategories: (callback) => {
        (async () => {
            try {
                logger.info("Requête demandée : select_allCategories()");
                const result = await pool.query("SELECT * FROM categorie");
                return (utils.isCallback(callback) ? callback(undefined, result.rows) : result.rows);
            } catch (e) {
                logger.error("Echec de la requête 'select_allCategories' : " + e.message)
                return (utils.isCallback(callback) ? callback(e) : e);
            }
        })();
    }
}