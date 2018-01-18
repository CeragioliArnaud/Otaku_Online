const pool = require('../dbManager').pool;
const utils = require('../Utils/functionsUtils');
const Manga = require('../Model/Manga');
const logger = require('../Utils/logger').logger_dbManager;

module.exports = {

    insert_addProduct: (manga, callback) => {
        (async () => {
            try {
                logger.info("Requête demandée : insert_addProduct(" + manga.title + " " + manga.reference + ")");
                await pool.query("BEGIN")

                const query1 = "INSERT INTO publisher (name) VALUES ($1) RETURNING id";
                const result1 = await pool.query(query1, [manga.publisher]);
                var idPublisher = result1.rows[0].id;

                const query2 = "INSERT INTO mangaka (first_name, last_name) VALUES ($1, $2) RETURNING id";
                const result2 = await pool.query(query2, [manga.mangaka, ""]);
                var idMangaka = result2.rows[0].id;

                const query3 = "INSERT INTO product (reference, title, volume_number, description, categorie, publish_date, price, publisher, mangaka) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id";
                const result3 = await pool.query(query3, [manga.reference, manga.title, manga.volumeNumber, manga.description, manga.categorie, manga.publishDate, manga.price, idPublisher, idMangaka]);

                await pool.query("COMMIT");

                if (utils.isCallback(callback))
                    return callback();
                else
                    return;
            } catch (e) {
                await pool.query("ROLLBACK")
                logger.error("Echec de la requête insert_addProduct(" + manga.title + " " + manga.reference + ") : " + e.message)
                return (utils.isCallback(callback) ? callback(new Error("Une erreur est survenue, réessayez ulterieurement")) : new Error("Une erreur est survenue, réessayez ulterieurement"));
            }
        })()
    },

    update_modifyProduct: (manga, callback) => {
        (async () => {
            try {
                logger.info("Requête demandée : update_modifyProduct(" + manga.id + ")");
                await pool.query("BEGIN");
                var i = 0;
                var parameters = [];
                var query = "UPDATE product SET ";
                if (utils.isNullOrBlank(manga.id) || isNaN(manga.id)) {
                    throw new Error("Contenu incorrect");
                }
                if (!utils.isNullOrBlank(manga.reference)) {
                    query += "reference = $" + i++ + ",";
                    parameters.push(manga.reference);
                }
                if (!utils.isNullOrBlank(manga.title)) {
                    query += "title = $" + i++ + ",";
                    parameters.push(manga.title);
                }
                if (!utils.isNullOrBlank(manga.volume_number)) {
                    if (isNaN(manga.volume_number)) {
                        throw new Error("Contenu incorrect");
                    }
                    query += "volume_number = $" + i++ + ",";
                    parameters.push(parseInt(manga.volume_number));
                }
                if (!utils.isNullOrBlank(manga.description)) {
                    query += "description = $" + i++ + ",";
                    parameters.push(manga.description);
                }
                if (!utils.isNullOrBlank(manga.categorie)) {
                    if (isNaN(manga.categorie)) {
                        query += "(SELECT id FROM categorie WHERE name=$" + i++ + "),";
                    } else {
                        query += "categorie = $" + i++ + ",";
                    }
                    parameters.push(manga.categorie);
                }
                if (!utils.isNullOrBlank(manga.publish_date)) {
                    query += "publish_date = $" + i++ + ",";
                    parameters.push(manga.publish_date);
                }
                if (!utils.isNullOrBlank(manga.price)) {
                    if (isNaN(manga.price)) {
                        throw new Error("Contenu incorrect");
                    }
                    query += "price = $" + i++ + ",";
                    parameters.push(manga.price);
                }
                if (!utils.isNullOrBlank(manga.mangaka)) {
                    if (isNaN(manga.mangaka)) {
                        query += "(SELECT id FROM mangaka WHERE concat(first_name, ' ', last_name)=$" + i++ + "),";
                        parameters.push('%' + manga.mangaka + '%');
                    } else {
                        query += "mangaka = $" + i++ + ",";
                        parameters.push(manga.mangaka);
                    }
                }
                if (!utils.isNullOrBlank(manga.images)) {
                    query += "images = $" + i++ + ",";
                    parameters.push(manga.images);
                }

                query = query.substring(0, query.length - 1);
                query += " WHERE id=$" + i++;
                parameters.push(manga.id);
                const result = await pool.query(query, parameters);
                if (result.rowCount != 1) {
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

    select_allMangas: (categorie, genre, price, callback) => {
        (async () => {
            try {
                logger.info("Requête demandée : select_allMangas()");
                var query = "SELECT DISTINCT p.id, p.reference, p.title, p.volume_number, p.price, c.name as categorie, p.images[1], " +
                    "(SELECT array_to_string(array_agg(DISTINCT g.name), ',') as genres " +
                    "FROM genre g LEFT JOIN product_genre pg on(g.id = pg.genre_id) " +
                    "WHERE pg.product_id = p.id) " +
                    "FROM product p " +
                    "INNER JOIN categorie c on(p.categorie = c.id) " +
                    "LEFT JOIN product_genre pg on(p.id = pg.product_id) " +
                    "INNER JOIN genre g on(pg.genre_id = g.id) " +
                    "WHERE p.deprecated=false AND p.id=pg.product_id";

                var parameters = [""];

                if (!utils.isNullOrBlank(categorie)) {
                    query += " AND (";
                    if (!Array.isArray(categorie)) {
                        categorie = [categorie];
                    }

                    categorie.forEach(cat => {
                        if (isNaN(cat)) {
                            query += " c.name=$" + parameters.length + " OR";
                            parameters.push(cat);
                        } else {
                            query += " c.id=$" + parameters.length + " OR";
                            parameters.push(parseInt(cat));
                        }
                    });
                    query = query.substring(0, query.length - 2) + ")";
                }

                if (!utils.isNullOrBlank(genre)) {
                    query += " AND (";
                    if (!Array.isArray(genre)) {
                        genre = [genre];
                    }

                    genre.forEach(gen => {
                        if (isNaN(gen)) {
                            query += " g.name=$" + parameters.length + " OR";
                            parameters.push(gen);
                        } else {
                            query += " g.id=$" + parameters.length + " OR";
                            parameters.push(parseInt(gen));
                        }
                    });
                    query = query.substring(0, query.length - 2) + ")";
                }

                if (!utils.isNullOrBlank(price)) {
                    if (!utils.isNullOrBlank(price.min)) {
                        price.min = 0;
                    }

                    if (!utils.isNullOrBlank(price.max)) {
                        price.max = 10000;
                    }
                    query += " AND (p.price BETWEEN $" + parameters.length + " AND $" + parameters.length + ")";
                    parameters.push(parseFloat(price.min));
                    parameters.push(parseFloat(price.max));
                }
                parameters.shift();
                query += " ORDER BY p.title";
                const result = await pool.query(query, parameters);
                return (utils.isCallback(callback) ? callback(undefined, result.rows) : result.rows);
            } catch (e) {
                logger.error("Echec de la requête 'select_allMangas' : " + e.message)
                return (utils.isCallback(callback) ? callback(new Error("Une erreur est survenue, réessayez ulterieurement")) : new Error("Une erreur est survenue, réessayez ulterieurement"));
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
                    var manga = new Manga(line.id, line.reference, line.title, line.volume_number, line.description, line.categorie, line.publish_date, line.price, line.publisher_name, line.mangaka_last_name + " " + line.mangaka_first_name, line.genres, line.images);
                    Object.freeze(manga);
                    return (utils.isCallback(callback) ? callback(undefined, manga) : manga);
                }
            } catch (e) {
                logger.error("Echec de la requête 'select_mangaById' : " + e.message)
                return (utils.isCallback(callback) ? callback(new Error("Une erreur est survenue, réessayez ulterieurement")) : new Error("Une erreur est survenue, réessayez ulterieurement"));
            }
        })();
    },

    select_mangaByName: (title, callback) => {
        (async () => {
            try {
                logger.info("Requête demandée : select_mangaByName(" + title + ")");
                const query = "SELECT p.id, p.reference, p.title, p.volume_number, p.description, p.publish_date, p.price, p.nb_sales, " +
                    "c.name as categorie, pu.name as publisher_name, m.first_name as mangaka_first_name, m.last_name as mangaka_last_name, ( " +
                    "SELECT array_to_string(array_agg(DISTINCT g.name), ',') as genres " +
                    "FROM genre g INNER JOIN product_genre pg on(g.id = pg.genre_id) " +
                    "WHERE pg.product_id = p.id), " +
                    "p.images " +
                    "FROM product p " +
                    "INNER JOIN categorie c on(p.categorie = c.id) " +
                    "INNER JOIN publisher pu on(p.publisher = pu.id) " +
                    "INNER JOIN mangaka m on(p.mangaka = m.id) " +
                    "WHERE lower(p.title) = $1";
                const result = await pool.query(query, ["" + title]);
                if (result.rowCount == 0) {
                    return (utils.isCallback(callback) ? callback(new Error("Le titre du produit n'a pas été trouvé")) : new Error("Le titre du produit n'a pas été trouvé"));
                } else {
                    var line = result.rows[0];
                    var manga = new Manga(line.id, line.reference, line.title, line.volume_number, line.description, line.categorie, line.publish_date, line.price, line.publisher_name, line.mangaka_last_name + " " + line.mangaka_first_name, line.genres, line.images);
                    Object.freeze(manga);
                    return (utils.isCallback(callback) ? callback(undefined, manga) : manga);
                }
            } catch (e) {
                logger.error("Echec de la requête 'select_mangaByName' : " + e.message)
                return (utils.isCallback(callback) ? callback(new Error("Une erreur est survenue, réessayez ulterieurement")) : new Error("Une erreur est survenue, réessayez ulterieurement"));
            }
        })();
    },

    select_searchName: (name, callback) => {
        (async () => {
            try {
                logger.info("Requête demandée : select_searchName(" + name + ")");
                const result = await pool.query('SELECT id, title FROM product WHERE lower(title) LIKE $1 ORDER BY title', ['%' + name + '%']);
                return (utils.isCallback(callback) ? callback(undefined, result.rows) : result.rows);
            } catch (e) {
                logger.error("Echec de la requête 'select_searchName' : " + e.message)
                return (utils.isCallback(callback) ? callback(e) : e);
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
    },

    select_allGenres: (callback) => {
        (async () => {
            try {
                logger.info("Requête demandée : select_allGenres()");
                const result = await pool.query("SELECT * FROM genre");
                return (utils.isCallback(callback) ? callback(undefined, result.rows) : result.rows);
            } catch (e) {
                logger.error("Echec de la requête 'select_allGenres' : " + e.message)
                return (utils.isCallback(callback) ? callback(e) : e);
            }
        })();
    }
}