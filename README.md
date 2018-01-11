#### Node JS 
Présentation de la technologie.

[Voir sujet détaillé](http://miageprojet2.unice.fr/User:Max/LPSIL_IDSE_-_Web_Multim%C3%A9dia_%2f%2f_Web_S%C3%A9mantique/Partie_1%3a_Application_Pictionnary). 

Concepts à mettre ne œuvre :

    - Implémentation d'un serveur NodeJs
    - Utilisation du framwork Express
    - Utilisation de la base de donnée (MYSQL)
    - Implémentation d'un formulaire d'inscription/connexion HTML5
    - Format d'échange JSON

* Technologies utilisées:
 * NodeJS, MySQL, HTML5, CSS3, javascript

#### A installer
* [NodeJS v4.2.4](https://nodejs.org/)  
* [Git](http://git-scm.com/)  
* [Serveur MySQL](https://www.mysql.com/downloads/)
* l'IDE [PHPStorm](https://www.jetbrains.com/phpstorm/) or [Sublime Text](http://www.sublimetext.com/3).
* Navigateurs récents (il est bon de tester avec différents navigateurs, comme Chrome, Firefox, Opera, IE)
 
#### Telecharger le projet

[![Github](https://assets-cdn.github.com/images/modules/logos_page/GitHub-Mark.png)](https://github.com/kbouzidi/lpsil)

#### Structure du projet
```
lpsil-web/
  |- public/
  |- models/
  |- test/
  |- server.js
  |- package.json
  |- README.md
```
#### Package.json

Créer un fichier package.json dans le dossier de notre projet :
```
{
    "name": "lpsil-web",
    "version": "0.0.1",
    "dependencies": {
           "body-parser": "^1.14.2",
           "ejs": "^2.3.4",
           "express": "^4.13.3",
           "log4js": "^0.6.29",
           "morgan": "^1.6.1",
           "mysql": "^2.10.2",
           "serve-favicon": "^2.3.0"
    },
    "author": "Mail <email@etu.unice.fr>",
    "description": "Enregistrement et authentification"
}
```

##### Installation des packages
```javascript
npm install
```

##### Création du serveur 

```language-javascript
var express = require('express');
var morgan = require('morgan'); // Charge le middleware de logging
var favicon = require('serve-favicon'); // Charge le middleware de favicon
var logger = require('log4js').getLogger('Server');
var app = express();


app.use(morgan('combined')); // Active le middleware de logging

app.use(express.static(__dirname + '/public')); // Indique que le dossier /public contient des fichiers statiques (middleware chargé de base)

app.use(function (req, res) { // Répond enfin
    res.send('Hello world!');

});

logger.info('server start');
app.listen(1313);
```

##### Ajouter les templates 

```language-javascript
// config
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
```

##### Définition des routes 

```language-javascript 
/* On affiche le formulaire d'enregistrement */

app.get('/', function(req, res){
    res.redirect('/login');
});

app.get('/login', function(req, res){
    res.render('login');
});

app.post('/login', function (req, res) {
    // TODO vérifier si l'utilisateur existe
});

app.get('/register', function (req, res) {
    // TODO ajouter un nouveau utilisateur
});
/* On affiche le profile  */
app.get('/profile', function (req, res) {
    // TODO  
    // On redirige vers la login si l'utilisateur n'a pas été authentifier 
    // Afficher le button logout                                                
});      
```

#### Base de donnée
##### Connection Simple
```language-javascript
var mysql = require('mysql');


var connection = mysql.createConnection({
    host: 'localhost',
    user: '< MySQL username >',
    password: '< MySQL password >',
    database: '<nom de vôtre base de données>'
});

connection.connect();

connection.query('SELECT * from < table name >', function (err, rows, fields) {
    if (!err)
        logger.info('Le résultat de la requête: ', rows);
    else
        logger.error(err);
});

connection.end();
```

##### Pool
```language-javascript

  var pool =  mysql.createPool({
    connectionLimit : 100, //important
	host : 'localhost',
	user : '< MySQL username >',
	password: '< MySQL password >',
        database: '<nom de vôtre base de données>'
  });	

  pool.getConnection(function(err,connection){
        if (err) {
          connection.release();
          res.json({"code" : 100, "status" : "Erreur de connexion à la DB"});
          return;
        }  

        logger.info('connecté en tant que ' + connection.threadId);
       
        connection.query("select * from user",function(err,rows){
            connection.release();
            if(!err) {
                res.json(rows);
            }          
        });

        connection.on('error', function(err) {      
              res.json({"code" : 100, "status" : "Erreur de connexion à la DB"});
              return;    
        });
  });
```

#### A faire

>    - Implémentation d'un formulaire d'inscription/connexion HTML5
>    - Gestion des sessions [express-session](https://www.npmjs.com/package/express-sessions)
>    - Dashboard utilisateur
>       - Modification des données utilisateurs
>       - Suppression du compte
>       - Accès au page après identification 
>    - Dashboard Administration
>     - Modification de profile 
>     - Suppression de profile 
>     - Révocation des identifiants
>   - Intégration de l'application Pictionnary
>   - Intégration d'un API externe (Facebook, Google et/ou twitter)


#### Date de remise 

<code> Le 23/01/2017 à 8h00 CET</code>

### Documentation et lien uties
- [NodeJS](https://nodejs.org/api/)
- [Express](http://expressjs.com/en/api.html)
