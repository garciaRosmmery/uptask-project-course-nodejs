const Sequelize = require('sequelize');
//const { Sequelize, Op, Model, DataTypes } = require("sequelize");
const bcrypt = require('bcrypt');

const db = require('../config/db');


const Proyectos = require('../models/Proyectos')

const Usuarios = db.define('usuarios', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: Sequelize.STRING(60),
        allowNull: false, //-- Este campo no puede estar vacio --
        validate: {
            isEmail: {
                msg: 'Agrega un email válido'
            },
            notEmpty: {
                msg: 'El email no puede estar vacio'
            }
        },
        unique: {
            args: true, //-- Habilito que sea único --
            msg: 'Usuario ya registrado'
        }

    },
    password: {
        type: Sequelize.STRING(60),
        allowNull: false, //-- Este campo no puede estar vacio --
        validate: {
            notEmpty: {
                msg: 'El password no puede estar vacio'
            }
        }
    },
    activo: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    token: Sequelize.STRING,
    expiracion: Sequelize.DATE
}, {
    hooks: {
        beforeCreate(usuario) {
            usuario.password = bcrypt.hashSync(usuario.password, bcrypt.genSaltSync(10));
        }
    }
});

//-- Métodos personalizados --
Usuarios.prototype.verificarPassword = function(password){
    return bcrypt.compareSync(password, this.password);
}

Usuarios.hasMany(Proyectos);

module.exports = Usuarios;


