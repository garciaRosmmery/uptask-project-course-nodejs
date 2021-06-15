//-- Archivo principal - archivo de configuración --
const express = require('express'); //-- Express soporta esta sintaxis --
const path = require('path');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');

//-- Importar las variables de entorno --
require('dotenv').config({path: '.env'});

const routes = require('./routes');

//-- Helpers con algunas funciones --
const helpers = require('./helpers');

//-- Crear la conexión a la base de datos --
const db = require('./config/db');
//const passport = require('passport');

//-- Importar modelos --
require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');

db.sync()
    .then(() => console.log('Conectado al servidor'))
    .catch(error => console.log(error))

//-- Crear una app en express --
const app = express();

//-- Indico dónde cargar los archivos estáticos (css, js) --
app.use(express.static('public'));

//-- Habilito template engine pug --
app.set('view engine', 'pug');

//-- Habilitar bodyParser para leer datos de formularios
//app.use(bodyParser.urlencoded({extends: true}));
app.use(express.urlencoded());
app.use(express.json());

//-- Agregamos express validator a toda la aplicación --
//app.use(expressValidator());

//-- Añadir la carpeta de las vistas --
app.set('views', path.join(__dirname, './views'));

//-- Agregar flash messages --
app.use(flash());

app.use(cookieParser());

//-- Las sesiones nos permiten navegar entre distintas páginas sin volvernos a autenticar --
app.use(session({
    secret: 'supersecreto',
    //-- Mantine la sesión viva --
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

//-- Pasar var dump a la aplicación (para que esté disponible en cualquier lugar de mi aplicación) --
app.use((req, res, next) => {
    res.locals.vardump = helpers.vardump;
    res.locals.mensajes = req.flash();
    res.locals.usuario = {...req.user} || null;
    next();
})


app.use('/', routes());

//-- Servidor y puerto --
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;

//-- Indicar por qué puerto va a escuchar --
app.listen(port, host, () => {
    console.log('Servidor funcionando');
});
