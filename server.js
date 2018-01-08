const express = require('express');
const app = express();
const properties = require('./Utils/properties');
require('./dbManager');
const logger = require('./Utils/logger').logger_server;
const bodyParser = require('body-parser');
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

app.all('/*', (req, res) => {
    logger.debug('Requête reçue : ' + req.url);
} )

app.get('/', function(req, res) {
    res.redirect('/index');
});

app.get('/login', function(req, res) {
    res.render('login');
});

app.get('/index', function(req, res) {
    res.render('index');
});

app.get('/register', function(req, res) {
    res.render('register');
});

app.get('/checkout3', function(req, res) {
    res.render('checkout3');
});

app.get('/customer-account', function(req, res) {
    res.render('customer-account');
});

app.get('/customer-order', function(req, res) {
    res.render('customer-order');
});

app.get('/customer-orders', function(req, res) {
    res.render('customer-orders');
});

app.get('/customer-whislist', function(req, res) {
    res.render('customer-wishlist');
});

app.get('/detail', function(req, res) {
    res.render('detail');
});

app.get('/faq', function(req, res) {
    res.render('faq');
});

app.get('/post', function(req, res) {
    res.render('post');
});

app.get('/text', function(req, res) {
    res.render('text');
});

app.get('/text-right', function(req, res) {
    res.render('text-right');
});

app.get('/basket', function(req, res) {
    res.render('basket');
});

app.get('/category', function(req, res) {
    res.render('category');
});

app.get('/category-full', function(req, res) {
    res.render('category-full');
});

app.get('/category-right', function(req, res) {
    res.render('category-right');
});

app.get('/checkout1', function(req, res) {
    res.render('checkout1');
});

app.get('/checkout2', function(req, res) {
    res.render('checkout2');
});

app.get('/checkout4', function(req, res) {
    res.render('checkout4');
});

app.get('/contact', function(req, res) {
    res.render('contact');
});

app.get('/blog', function(req, res) {
    res.render('blog');
});

app.get('/*', function(req, res) {
    res.render('404');
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