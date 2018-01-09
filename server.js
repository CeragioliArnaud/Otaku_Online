const express = require('express');
const app = express();
const properties = require('./Utils/properties');
require('./dbManager');
const logger = require('./Utils/logger').logger_server;
const bodyParser = require('body-parser');
const User = require('./Model/User')
var urlencodedparser = bodyParser.urlencoded({ extended: false });
// config

app.disable('x-powered-by');

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use(express.static(__dirname + '/public')); // Indique que le dossier /public contient des fichiers statiques (middleware chargé de base)

logger.info(properties.get("console.start"));

//--- ANNONCES PAGES DBT ---

app.all('/*', (req, res, next) => {
    logger.debug('Requête reçue : ' + req.url);
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
    UName = req.body.username;
    UPwd = req.body.password;
    //dbManager.insertUser(UName, UPwd);
    dbManager.findUser(UName);
    res.redirect('/index')
    res.end;
});

app.listen(1313);



// ARRET DU SERVEUR

process.on('SIGINT', () => {
	process.stdout.write("\r\x1b[K");
    logger.info(properties.get("console.stop"));
    process.exit(0);
});

process.on('uncaughtException', (e) => {
    logger.log("FATAL", e);
    process.exit(99);
})