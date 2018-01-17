const pool = require('../dbManager').pool;
const utils = require('../Utils/functionsUtils');
const User = require('../Model/User');
const logger = require('../Utils/logger').logger_dbManager;
module.exports = {

    insert_createUser: (user, callback) => {
        (async() => {
            try {
                console.log(JSON.stringify(user));
                logger.info("Requête demandée : insert_createUser(" + user.pseudo + ", " + user.email + ")");

                const query0 = "SELECT CASE WHEN pseudo!=$1 THEN NULL ELSE pseudo END, CASE WHEN email!=$2 THEN NULL ELSE email END " +
                    "FROM users " +
                    "WHERE pseudo = $1 OR email = $2";
                const result0 = await pool.query(query0, [user.pseudo, user.email]);

                if (result0.rowCount == 2) {
                    return (utils.isCallback(callback) ? callback(new Error("Pseudo et adresse email déjà utilisés")) : new Error("Pseudo et adresse email déjà utilisés"));
                } else if (result0.rowCount == 1) {
                    if (utils.isNullOrBlank(result0.rows[0].pseudo))
                        return (utils.isCallback(callback) ? callback(new Error("Adresse email déjà existante")) : new Error("Adresse email déjà existante"));
                    else
                        return (utils.isCallback(callback) ? callback(new Error("Pseudo déjà utilisé")) : new Error("Pseudo déjà utilisé"));
                } else {
                    const query1 = "INSERT INTO users (id, first_name, last_name, pwd, pseudo, email, phone, state) VALUES (DEFAULT, $1, $2, $3, $4, $5, $6, 'TEMP') RETURNING id";
                    const parameters1 = [user.first_name, user.last_name, user.pwd, user.pseudo, user.email, user.phone];
                    const result1 = await pool.query(query1, parameters1);
                    var userOut = user;
                    delete userOut.pwd;
                    delete userOut.phone;
                    Object.freeze(userOut);
                    return (utils.isCallback(callback) ? callback(undefined, userOut) : userOut);
                }
            } catch (e) {
                logger.error("Echec de la requête insert_createUser(" + user.pseudo + ", " + user.email + ") : " + e.message);
                return (utils.isCallback(callback) ? callback(new Error("Une erreur est survenue, réessayez ulterieurement")) : new Error("Une erreur est survenue, réessayez ulterieurement"));
            }
        })()
    },

    select_authenticateUser: (login, pwd, callback) => {
        (async() => {
            try {
                logger.info("Requête demandée : select_authenticateUser(" + login + ")");
                var query = "SELECT first_name, last_name, pseudo, email, CASE WHEN state='ADMI' THEN state ELSE NULL END AS state " +
                    "FROM users " +
                    "WHERE " + (utils.isEmail(login) ? "email" : "pseudo") + "=$1 AND pwd=$2 AND state!='SUSP'";

                const result = await pool.query(query, [login, pwd]);
                if (result.rowCount == 0) {
                    return (utils.isCallback(callback) ? callback(new Error("Identifiants incorrects")) : new Error("Identifiants incorrects"));
                } else if (result.rowCount > 1) {
                    logger.error("select_authenticateUser(" + login + ") - Erreur : plusieurs ligne ont été retournées");
                    return (utils.isCallback(callback) ? callback(new Error("Une erreur est survenue, réessayez ulterieurement")) : new Error("Une erreur est survenue, réessayez ulterieurement"));
                } else {
                    var line = result.rows[0];
                    var user = new User(line.first_name, line.last_name, line.pseudo, line.email);
                    if (!utils.isNullOrBlank(line.state)) {
                        user.isAdmin = true;
                    }
                    Object.freeze(user);
                    return (utils.isCallback(callback) ? callback(undefined, user) : user);
                }
            } catch (e) {
                logger.error("Echec de la requête select_authenticateUser(" + login + ") : " + e.message)
                return (utils.isCallback(callback) ? callback(new Error("Une erreur est survenue, réessayez ulterieurement")) : new Error("Une erreur est survenue, réessayez ulterieurement"));
            }
        })()
    },

    // TODO Comment retrouver les anciennes config ? Envoyer en paramètre l'ancien User ? Chercher le pseudo ou l'adresse email ? et si les deux sont changer ?
    /*
    update_updateUser: (user, email) => {
        (async () => {
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
            }
        })().catch(e => logger.error(e.message))
    },
    */

    update_suspendUser: (login, callback) => {
        (async() => {
            try {
                logger.info("Requête demandée : update_suspendUser(" + login + ")");

                const query = "UPDATE users SET state='SUSP' WHERE " + (utils.isEmail(login) ? "email" : "pseudo") + "=$1 RETURNING *";
                const result = await pool.query(query, [login]);

                if (result.rowCount == 0) {
                    return (utils.isCallback(callback) ? callback(new Error("Aucun utilisateur trouvé avec cet identifiant")) : new Error("Aucun utilisateur trouvé avec cet identifiant"));
                } else {
                    if (utils.isCallback(callback))
                        return callback();
                    else
                        return;
                }
            } catch (e) {
                logger.error("Echec de la requête update_suspendUser(" + login + ") : " + e.message)
                return (utils.isCallback(callback) ? callback(new Error("Une erreur est survenue.")) : new Error("Une erreur est survenue."));
            }
        })()
    },

    update_administerUser: (login, callback) => {
        (async() => {
            try {
                logger.info("Requête demandée : update_administerUser(" + login + ")");

                const query = "UPDATE users SET state='ADMI' WHERE " + (utils.isEmail(login) ? "email" : "pseudo") + "=$1 RETURNING *";
                const result = await pool.query(query, [login]);

                if (result.rowCount == 0) {
                    return (utils.isCallback(callback) ? callback(new Error("Aucun utilisateur trouvé avec cet identifiant")) : new Error("Aucun utilisateur trouvé avec cet identifiant"));
                } else {
                    if (utils.isCallback(callback))
                        return callback();
                    else
                        return;
                }
            } catch (e) {
                logger.error("Echec de la requête update_administerUser(" + login + ") : " + e.message);
                return (utils.isCallback(callback) ? callback(new Error("Une erreur est survenue.")) : new Error("Une erreur est survenue."));
            }
        })()
    },

    update_changePwd: (pseudo, oldPwd, newPwd, callback) => {
        (async() => {
            try {
                logger.info("Requête demandée : update_changePwd(" + pseudo + ")");

                const query0 = "SELECT id FROM users WHERE pseudo=$1 AND pwd=$2";
                const result0 = await pool.query(query0, [pseudo, oldPwd]);

                console.log(JSON.stringify(result0));
                if (result0.rowCount == 0) {
                    return (utils.isCallback(callback) ? callback(new Error("Ancien mot de passe incorrect")) : new Error("Ancien mot de passe incorrect"));
                }

                console.log("pseudo : " + pseudo + " / " + oldPwd + " / " + newPwd);
                const query1 = "UPDATE users SET pwd=$2 WHERE id=$1 RETURNING *";
                const result1 = await pool.query(query1, [result0.rows[0].id, newPwd]);

                if (result1.rowCount == 0) {
                    return (utils.isCallback(callback) ? callback(new Error("Une erreur est survenue.")) : new Error("Une erreur est survenue."));
                } else {
                    if (utils.isCallback(callback))
                        return callback();
                    else
                        return;
                }
            } catch (e) {
                logger.error("Echec de la requête update_administerUser(" + pseudo + ") : " + e.message);
                return (utils.isCallback(callback) ? callback(new Error("Une erreur est survenue.")) : new Error("Une erreur est survenue."));
            }
        })()
    }
}