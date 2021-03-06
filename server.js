const http = require('http');
const express = require('express');
const app = express();
const properties = require('./Utils/properties');
const dbManager = require('./dbManager');
const logger = require('./Utils/logger').logger_server;
const S = require('string');
const utils = require('./Utils/functionsUtils');
const bodyParser = require('body-parser');
const User = require('./Model/User');
const Manga = require('./Model/Manga');
const userController = require('./controller/user');
const mangaController = require('./controller/manga');
const session = require('express-session');
const io = require('socket.io').listen(properties.get('socket.port'));

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


/****************
 *				*
 *   Connexion   *
 *   Socket.io   *
 *				*
 ****************/

io.on('connection', socket => {
    socket.on('chat message', msg => {
        io.emit('chat message', msg);
    });
});

//--- ANNONCES PAGES DBT ---

app.all('/*', (req, res, next) => {
    logger.debug('Requête reçue (' + (req.session.user ? req.session.user._pseudo : 'anonyme') + ') : ' + req.url);
    next();
});

app.get('/', (req, res) => {
    res.redirect('/index');
});

// detail.ejs + head.ejs + productList.ejs 
/********************
 *				    *
 *   Selectionnez   *
 *   Catégories     *
 *				    *
 *******************/

app.get('/categories', (req, res) => {
    mangaController.select_allCategories((err, result) => {
        if (err) {
            res.status(500).send("Une erreur est survenue");
        } else {
            res.status(200).send(result);
        }
    })
});

// detail.ejs + productList.ejs 
/********************
 *				    *
 *     Filtre       *
 *  Genres/Mangas   *
 *				    *
 *******************/

app.get('/genres', (req, res) => {
    mangaController.select_allGenres((err, result) => {
        if (err) {
            res.status(500).send("Une erreur est survenue");
        } else {
            res.status(200).send(result);
        }
    })
});

app.get('/mangas', (req, res) => {
    mangaController.select_allMangas(req.query.categorie, req.query.genre, req.query.price, (err, result) => {
        if (err) {
            res.status(500).send("Une erreur est survenue");
        } else {
            res.status(200).send(result);
        }
    });
});

// detail.ejs 
/********************
 *				    *
 *  Affiche données *
 *      Mangas      *
 *				    *
 *******************/

app.get('/detail', (req, res) => {
    if (req.query.id) {
        mangaController.select_mangaById(req.query.id, (err, result) => {
            if (err) {
                res.status(500).send("Une erreur est survenue");
            } else {
                res.render('detail', { req: req, manga: result });
            }
        })
    } else {
        mangaController.select_mangaByName(S(req.query.name).toLowerCase().s, (err, result) => {
            if (err) {
                res.redirect('productList');
            } else {
                res.render('detail', { req: req, manga: result });
            }
        })
    }
});

// head.ejs
/********************
 *				    *
 *  Affiche données *
 *     SearchBar    *
 *				    *
 *******************/

app.get('/search', (req, res) => {
    mangaController.select_searchName(S(req.query.name).toLowerCase().s, (err, result) => {
        if (err) {
            res.status(500).send("Une erreur est survenue");
        } else {
            res.status(200).send(result);
        }
    })
});

// register.ejs 
/********************
 *				    *
 *  Insert / Update *
 *   User / Infos   *
 *				    *
 *******************/

app.post('/register', (req, res) => {
    var user = new User("", "", req.body.pseudo, req.body.email, "", req.body.pwd);
    userController.insert_createUser(user, (err, result) => {
        if (err) {
            res.status(500).send(err.message);
        } else {
            req.session.user = result;
            res.status(200).send();
        }
    })
});

app.post('/updatePwd', (req, res) => {
    if (req.session.user) {
        userController.update_changePwd(req.session.user._pseudo, req.body.oldPwd, req.body.newPwd, (err, result) => {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.status(200).send();
            }
        })
    } else {
        res.status(401).send();
    }
});

app.post('/updateInfos', (req, res) => {
    if (req.session.user) {
        if (utils.isNullOrBlank(req.body.pseudo) || utils.isNullOrBlank(req.body.email))
            res.status(422).send("Pseudo ou mot de passe manquant");
        user = new User(req.body.first_name, req.body.last_name, req.body.pseudo, req.body.email, req.body.phone, "");
        userController.update_changeInfos(req.session.user._pseudo, req.session.user._email, user, (err, newUser) => {
            if (err) {
                res.status(500).send(err.message);
            } else {
                req.session.user = newUser;
                res.status(200).send();
            }
        })
    } else {
        res.status(401).send();
    }
});

/***********************
 *				       *
 *  Pages accès Admin  *
 *				       *
 ***********************/

app.all('/admin/*', (req, res, next) => {
    if (req.session.user && req.session.user._isAdmin) {
        next();
    } else {
        res.status(404).redirect('/404');
    }
});

app.get('/admin/test', (req, res) => {
    res.status(200).send("OK");
});

app.post('/admin/user', (req, res) => {
    //TODO récup les infos depuis la requête
    var user = new User('', '', '', '', '', '');
    userController.del_User(user, (err, result) => {
        if (err) {
            res.redirect('/adminManagement')
            res.end;

        } else {
            //TODO
        }
    })

    //res.render('');
});

/***********************
 *				       *
 *     Bloquer user    *
 *				       *
 ***********************/

app.post('/admin/user/block', function(req, res) {
    userController.update_suspendUser(req.body.identifiant, err => {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.status(200).send();
        }
    })
})

// admin_management.ejs
/***********************
 *				       *
 *  Administrer User   *
 *				       *
 ***********************/

app.post('/admin/user/administer', function(req, res) {
    userController.update_administerUser(req.body.identifiant, err => {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.status(200).send();
        }
    })
})

// detail.ejs
/***********************
 *				       *
 *  Supprimer produit  *
 *				       *
 ***********************/

app.post('/admin/user/delProd', function(req, res) {
    mangaController.update_suspendUser(req.body.identifiant, err => {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.status(200).send();
        }
    })
})

// admin_management.ejs
/***********************
 *				       *
 *   Ajouter produit   *
 *				       *
 ***********************/

app.post('/admin/manga/add', (req, res) => {
    var manga = new Manga(
        "",
        req.body.reference,
        req.body.title,
        req.body.volume_Number,
        req.body.description,
        req.body.categorie,
        req.body.publish_date,
        req.body.price,
        req.body.publisher,
        req.body.mangaka,
        req.body.genre
    );
    console.log(JSON.stringify(manga));
    mangaController.insert_addProduct(manga, err => {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.status(200).send();
        }
    })
});

// admin_management.ejs
/***********************
 *				       *
 *   Modifier produit  *
 *				       *
 ***********************/

app.post('/admin/manga/modify', (req, res) => {
    var manga = new Manga(
        req.body.id,
        req.body.reference,
        req.body.title,
        req.body.volume_Number,
        req.body.description,
        req.body.categorie,
        req.body.publish_date,
        req.body.price,
        req.body.publisher,
        req.body.mangaka,
        "",
        req.body.images
    );
    mangaController.update_modifyProduct(manga, err => {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.status(200).send();
        }
    })
});

app.get('/admin/manga/getById/:id', (req, res) => {
    mangaController.select_mangaById(req.params["id"], (err, result) => {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.status(200).send(result);
        }
    });
});

app.get('/admin/:id', function(req, res) {
    res.render('admin_' + req.params["id"], { req: req }, (err, file) => {
        if (err) {
            res.redirect('../404');
        } else {
            res.send(file);
        }
    });
});

app.post('/login', (req, res) => {
    userController.select_authenticateUser(req.body.identifiant, req.body.pwd, (err, User) => {
        if (err) {
            logger.info(err);
            res.status(401).send(err.message);
        } else {
            req.session.user = User;
            logger.info(User.pseudo + " s'est connecté");
            res.status(200).send(User);
        }
    });
});

app.post('/productAll', (req, res) => {
    mangaController.select_mangaById(req.body.id, (err, result) => {
        if (err) {
            logger.info(err);
            res.status(500).send(err.message);
        } else {
            res.status(200).send(result);
        }
    });
});

/******************
 *				  *
 *     LOGOUT     *
 *				  *
 ******************/

app.post('/logout', (req, res) => {
    req.session.user = undefined;
    res.status(200).send();
});

/******************
 *				  *
 *   navigation   *
 *   dynamique    *
 *				  *
 ******************/

app.get('/customer-*', (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.status(404).redirect('/register');
    }
});

app.get('/:id', function(req, res) {
    res.render(req.params["id"], { req: req }, (err, file) => {
        if (err) {
            res.status(404).redirect('/404');
        } else
            res.send(file);
    });
});



/****************
 *				*
 * Lancement du *
 *    Serveur	*
 *				*
 ****************/

var server = app.listen(properties.get("server.port"), properties.get("server.hostname"), () => {
    dbManager.start();
    logger.info(properties.get("console.start"));
});

/*****************
 *				 *
 * Arret/Erreurs *
 *    Serveur	 *
 *				 *
 ***************µ*/

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