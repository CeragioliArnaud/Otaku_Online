const Sequelize = require('sequelize');
const sequelize = new Sequelize('nodeUser', 'root', 'Pythonisso2017', {
    host: 'localhost',
    dialect: 'mysql',

    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
    },

    // http://docs.sequelizejs.com/manual/tutorial/querying.html#operators
    operatorsAliases: false
});

const User = sequelize.define('user', {
    username: Sequelize.STRING,
    password: Sequelize.STRING,
});
//ANONYME
module.exports = {

    //INSERT USER TO DB
    insertUser: (user, pwd) => {
        sequelize.sync()
            .then(() => User.create({
                username: user,
                password: pwd
            }))
            .then(result => {
                console.log(result.toJSON());
            });

    },

    //SELECT USER FROM DB
    findUser: (user) => {
        sequelize.sync()
            .then(() => User.findOne({ where: { username: user } }))
            .catch(err => console.log(err))
            .then(result => {
                if (result == null) {
                    console.log("Données d'utilisateur non trouvées");
                } else {
                    console.log(result.toJSON());
                }
            });
    },

    //UPDATE USER IN DB
    updateUser: (user) => {
        sequelize.sync()
            .then(() => User.findOne({ where: { username: user } }))
            .catch(err => console.log(err))
            .then(result => {
                if (result == null) {
                    console.log("Données d'utilisateur non trouvées");
                } else {
                    console.log(result.toJSON());
                }
            });
    }

}