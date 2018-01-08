var Client = require('./dbManager');

module.exports = {
/*
    insertUser: (user, pwd) => {
        Client.connect(err => {
            if (err) {
                logger.error('insertUser() - Echec de connexion à la base de données : ' + err.message);
                throw err;
            }

            const sql = "INSERT INTO users (username, password) VALUES ('" + user + "', '" + pwd + "')";
            Client.query(sql, (err, result) => {
                if (err) {
                    logger.error('insertUser(' + user + ') - Echec de la requête : ' + err.message);
                    throw err;
                }
                looger.info("Enregistrement d'un nouvel utilisateur. Nom : " + user);
            });
        });
    },

    findUser: (user, pwd, callback) => {
        Client.connect(err => {
            if (err) {
                logger.error('findUser() - Echec de connexion à la base de données : ' + err.message);
                throw err;
            }

            const sql = "SELECT username from users where username = ? and password = ?";
            Client.query(sql, [user, pwd], (err, result) => {
                if (err) {
                    logger.error('findUser(' + user + ') - Echec de la requête : ' + err.message);
                    throw err;
                }
                callback(result);
            });
        });
    },

    findUser2: (user, pwd, callback) => {
        (async () => {
            try {
                const client = Client.connect();
                const query = "SELECT username from users where username= ? and password= ?";
                const result = await Client.query(query, [user, pwd]);


            } catch (e) {
                response.sendResponse(res, 500);
                throw new Error("Echec de getAutoAnswer(" + code + ") : ", e);
            }
        })().catch(e => logger.error(e.message));
    },

    updateUser: (user, pwd, email) => {
        Client.connect(err => {
            if (err) {
                logger.error('updateUser() - Echec de connexion à la base de données : ' + err.message);
                throw err;
            }
            
            const sql = "UPDATE users SET username='" + user + "', password ='" + pwd + "' where username='" + user + "'";
            Client.query(sql, (err, result) => {
                if (err) {
                    logger.error('updateUser(' + user + ') - Echec de la requête : ' + err.message);
                    throw err;
                }
                console.log("Les données de l'utilisateur " + user + " ont bien étés modifiées.");
            });
        });
    },

    delUser: (user) => {
        Client.connect(err => {
            if (err) {
                logger.error('updateUser() - Echec de connexion à la base de données : ' + err.message);
                throw err;
            }
            
            const sql = "DELETE from users where username='" + user + "'";
            Client.query(sql, (err, result) => {
                if (err) {
                    logger.error('delUser(' + user + ') - Echec de la requête : ' + err.message);
                    throw err;
                }
                console.log("L'utilisateur " + user + " à bien été supprimé.");
            });
        });
    }*/
}