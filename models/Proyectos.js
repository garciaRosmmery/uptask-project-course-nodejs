const Sequelize = require('sequelize');
const slug = require('slug');
const shortid = require('shortid');

//-- Importo la conexión y la configuración de la base de datos --
const db = require('../config/db');


const Proyectos = db.define('proyectos', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: Sequelize.STRING(100),
    url: Sequelize.STRING(100)
}, {
    hooks: {
        beforeCreate(proyecto) {
            
            let url = slug(proyecto.nombre).toLowerCase();

            proyecto.url = `${url}-${shortid.generate()}`
        }
    }
});

module.exports = Proyectos;
