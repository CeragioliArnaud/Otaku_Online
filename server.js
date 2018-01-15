const express = require('express');
const app = express();
const properties = require('./Utils/properties');
const dbManager = require('./dbManager');
const logger = require('./Utils/logger').logger_server;
const bodyParser = require('body-parser');
const session = require('express-session');
const User = require('./Model/User');
const user = require('./controller/user');

var urlencodedparser = bodyParser.urlencoded({ extended: false });
// config

app.disable('x-powered-by');

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public')); // Indique que le dossier /public contient des fichiers statiques (middleware chargé de base)
app.use(session({
    secret: "azerty1234",
    resave: false,
    saveUninitialized: true
}));

//--- ANNONCES PAGES DBT ---

app.all('/*', (req, res, next) => {
    logger.debug('Requête reçue (' + (req.session.user ? req.session.user._pseudo : 'anonyme' ) + ') : ' + req.url);
    next();
});



app.get('/', function(req, res) {
    res.redirect('/index');
});

app.get('/:id', function(req, res) {
    res.render(req.params["id"], {}, (err, file) => {
        if(err)
            res.redirect('404');
        else
            res.send(file);
    });
});

app.post('/customer-order', function(req, res) {
    res.render('customer-order');
});

app.post('/customer-orders', function(req, res) {
    res.render('customer-orders');
});

app.post('/checkout1', function(req, res) {
    res.render('checkout1');
});

app.post('/checkout2', function(req, res) {
    res.render('checkout2');
});

app.post('/checkout3', function(req, res) {
    res.render('checkout3');
});

app.post('/checkout4', function(req, res) {
    res.render('checkout4');
});

//--- ANNONCES PAGES FIN ---

app.post('/login', urlencodedparser, function(req, res) {
    user.select_authenticateUser(req.body.pseudo, req.body.pwd, (err,User) => {
        if(err) {
            logger.info(err);
            res.status(401);
            res.redirect('/login');
            res.end;
        } else {
            req.session.user = User;
            logger.info(User.pseudo + " s'est connecté");
            res.status(200);
            res.redirect('/index');
            res.end;
        }
    });
});


/****************
*				*
*  Lancement du *
*    Serveur	*
*				*
****************/

var server = app.listen(properties.get("server.port"), properties.get("server.hostname"), () => {
	dbManager.start();
    logger.info(properties.get("console.start"));
});

/****************
*				*
* Arret/Erreurs *
*    Serveur	*
*				*
****************/

process.on('SIGINT', () => {
    process.stdout.write("\r\x1b[K");
    dbManager.stop();
    server.close();
    logger.info(properties.get("console.stop"));
    process.exit(0);
});

process.on('uncaughtException', (e) => {
    logger.log("fatal", e);
    dbManager.stop();
    server.close();
    process.exit(99);
})