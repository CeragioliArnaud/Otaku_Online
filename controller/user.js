const pool = require('./dbManager');
const utils = require('../Utils/functionsUtils');
const User = require('../Model/User');
const logger = require('../Utils/logger');

module.exports = {

    insert_createUser: (user, callback) => {
        (async () => {
            const client = await pool.connect();
            try {
                logger.info("Requête demandée : insert_createUser(" + user.toString() + ")");

                const query0 =  "SELECT CASE WHEN pseudo!='$1' THEN NULL ELSE pseudo END, CASE WHEN email!='$2' THEN NULL ELSE email END " +
                                "FROM users " +
                                "WHERE pseudo = '$1' OR email = '$2'";
                const parameters0 = [user.pseudo, user.email];
                const result0 = await client.query(query0, parameters0);

                if(result0.rowCount == 2) {
                    return (utils.isCallback(callback) ? callback(new Error("Pseudo et adresse email déjà utilisés")) : new Error("Pseudo et adresse email déjà utilisés"));
                } else if(result0.rowCount == 1) {
                    if(utils.isNullOrBlank(result0.rows[0].pseudo))
                        return (utils.isCallback(callback) ? callback(new Error("Adresse email déjà existante")) : new Error("Adresse email déjà existante"));
                    else
                        return (utils.isCallback(callback) ? callback(new Error("Pseudo déjà utilisé")) : new Error("Pseudo déjà utilisé"));
                } else {
                    const query1 = "INSERT INTO users (first_name, last_name, pwd, pseudo, email, phone, state) VALUES ($1, $2, $3, $4, $5, $6, 'TEMP') RETURNING id";
                    var parameters1 = [user.first_name, user.last_name, user.pwd, user.pseudo, user.email, user.phone];
                    const result1 = await client.query(query1, parameters1);
                    
                    return (utils.isCallback(callback) ? callback(undefined, result1.rows[0].id) : result1.rows[0].id);
                }
            } catch (e) {
                logger.error("Echec de la requête insert_createUser(" + user.toString() + ") : " + e.message)
                throw e;
            } finally {
                await client.release();
            }
        })().catch(e => logger.error(e.message))
    },

    select_authenticateUser: (login, pwd, callback) => {
        (async () => {
            const client = await pool.connect();
            try {
                logger.info("Requête demandée : select_authenticateUser(" + login + ")");
                var query = "SELECT first_name, last_name, pseudo, email, CASE WHEN state='ADMI' THEN state ELSE NULL END " +
                            "FROM users " + 
                            "WHERE " + (utils.isEmail(email) ? "email" : "pseudo") + "=$1 AND pwd=$2 AND state!='SUSP'";
                const result = await client.query(query, [login, pwd]);
                
                if(result.rowCount == 0) {
                    return (utils.isCallback(callback) ? callback(new Error("Echec d'authentification")) : new Error("Echec d'authentification"));
                } else if(result.rowCount > 1) {
                    logger.error("select_authenticateUser(" + login + ") - Erreur : plusieurs ligne ont été retournées");
                    return (utils.isCallback(callback) ? callback(new Error("Une erreur est survenue, réessayez ulterieurement")) : new Error("Une erreur est survenue, réessayez ulterieurement"));
                } else {
                    var line = result.rows[0];
                    var user = new User(line.first_name, line.last_name, line.pseudo, line.email);
                    if(!utils.isNullOrBlank(line.state))
                        user.isAdmin = true;
                    Object.freeze(user);
                    return (utils.isCallback(callback) ? callback(undefined, user) : user);
                }
            } catch (e) {
                logger.error("Echec de la requête insertUser(" + user.toString() + ") : " + e.message)
                throw e;
            } finally {
                await client.release();
            }
        })().catch(e => logger.error(e.message))
    },

    // TODO Comment retrouver les anciennes config ? Envoyer en paramètre l'ancien User ? Chercher le pseudo ou l'adresse email ? et si les deux sont changer ?
    /*
    update_updateUser: (user, email) => {
        (async () => {
            const client = await pool.connect();
            try {
                logger.info("Requête demandée : update_updateUser(" + user.toString() + ")");
                const query = "UPDATE users SET first_name=$1, last_name=$2, pseudo=$3, email=$4, phone=$5";
                var parameters = [user.first_name, user.last_name, user.pseudo, user.email, user.phone];
                const result = await client.query(query, parameters);
                // TODO refaire le retour
                return (utils.isCallback(callback) ? callback(result.rows[0].id) : result.rows[0].id);
            } catch (e) {
                logger.error("Echec de la requête update_updateUser(" + user.toString() + ") : " + e.message)
                throw e;
            } finally {
                await client.release();
            }
        })().catch(e => logger.error(e.message))
    },
    */

    update_suspendUser: (login, callback) => {
        (async () => {
            const client = await pool.connect();
            try {
                logger.info("Requête demandée : update_suspendUser(" + login + ")");
                const query = "UPDATE users SET state='SUSP' WHERE " + (utils.isEmail(email) ? "email" : "pseudo") + "=$1";
                const result = await client.query(query, [login]);
                
                if(result.rowCount == 0) {
                    return (utils.isCallback(callback) ? callback(new Error("Aucun utilisateur trouvé avec cet identifiant")) : new Error("Aucun utilisateur trouvé avec cet identifiant"));
                } else {
                    return (utils.isCallback(callback) ? callback(undefined) : undefined);
                }
            } catch (e) {
                logger.error("Echec de la requête update_suspendUser(" + login + ") : " + e.message)
                throw e;
            } finally {
                await client.release();
            }
        })().catch(e => logger.error(e.message))
    }
}