//-- Importar las variables de entorno --
require('dotenv').config({path: '.env'});

module.exports = {

    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
    host: process.env.MAILTRAP_HOST,
    port: process.env.MAILTRAP_PORT
}