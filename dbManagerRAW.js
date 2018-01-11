var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Pythonisso2017",
    database: "nodeuser"
});



module.exports = {

    //DBT USERS CMDS
    insertUser: (user, pwd) => {
        con.connect(function(err) {
            if (err) throw err;
            console.log("Connected!");
            var sql = "INSERT INTO users (username, password) VALUES ('" + user + "', '" + pwd + "')";
            con.query(sql, function(err, result) {
                if (err) throw new Error("Ca ne fonctionne pas");
                console.log("1 enregistrement inséré. Nom: " + user + "");
            });
        });
    },

    findUser: (user, pwd) => {
        con.connect(function(err) {
            if (err) throw err;
            console.log("Connected!");
            var sql = "SELECT username from users where username='" + user + "' and password='" + pwd + "'";
            con.query(sql, function(err, result) {
                if (err) throw new Error("Ca ne fonctionne pas");
                console.log("L'utilisateur " + user + " à été trouvé");
            });
        });
    },

    updateUser: (user, pwd, email) => {
        con.connect(function(err) {
            if (err) throw err;
            console.log("Connected!");
            var sql = "UPDATE users SET username='" + user + "', password ='" + pwd + "' where username='" + user + "'";
            con.query(sql, function(err, result) {
                if (err) throw new Error("Ca ne fonctionne pas");
                console.log("Les données de l'utilisateur " + user + " ont bien étés modifiées.");
            });
        });
    },

    delUser: (user) => {
        con.connect(function(err) {
            if (err) throw err;
            console.log("Connected!");
            var sql = "DELETE from users where username='" + user + "'";
            con.query(sql, function(err, result) {
                if (err) throw new Error("Ca ne fonctionne pas");
                console.log("L'utilisateur " + user + " à bien été supprimé.");
            });
        });
    },
    //FIN USERS CMDS

    //DBT MANGAS CMDS

    findGenre: (genre) => {
        con.connect(function(err) {
            if (err) throw err;
            console.log("Connected!");
            var sql = "";
            con.query(sql, function(err, result) {
                if (err) throw new Error("Ca ne fonctionne pas");
                console.log("Les documents avec le genre " + genre + "");
            });
        });
    }
}