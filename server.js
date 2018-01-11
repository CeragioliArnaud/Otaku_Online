var express = require('express');
var dbManager = require('./dbManagerRAW');
var logger = require('log4js').getLogger('Server');
var bodyParser = require('body-parser');
var app = express();
var UName = "";
var UPwd = "";
var urlencodedparser = bodyParser.urlencoded({ extended: false });
// config
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('images', __dirname + '/images');


app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname + '/public')); // Indique que le dossier /public contient des fichiers statiques (middleware chargé de base)

logger.info('server start');

//--- ANNONCES PAGES DBT ---

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

app.get('/bucket', function(req, res) {
    res.render('bucket');
});

app.get('/images/:id', function(req, res) {
    res.redirect('./Soleil_Manga.jpg');
});

//--- ANNONCES PAGES FIN ---

app.post('/login', urlencodedparser, function(req, res) {
    UName = req.body.username;
    UPwd = req.body.password;
    //dbManager.insertUser(UName, UPwd);
    dbManager.findUser(UName);
    res.end;
    res.redirect('/index')
});

app.listen(1313);

process.on('uncaughtException', (e) => {
    logger.error("FATAL : " + e);
    process.exit(99);
})