const passport = require('passport');
const crypto = require('crypto'); //-- Utilidad que nos va a permitir generar un token --
const bcrypt = require('bcrypt');

const Usuarios = require('../models/Usuarios');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const enviarEmail = require('../handlers/email');

exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos campos son obligatorios'
});

//-- Función para revisar si el usuario esta logueado o no --
exports.usuarioAutenticado = (req, res, next) => {

    //-- Si el usuario esta autenticado, adelante --
    if(req.isAuthenticated())
    {
        return next();
    }

    //-- Sino esta autenticado, redirigir al formulario --
    return res.redirect('/iniciar-sesion');
}

//-- Función para cerrar sesión --
exports.cerrarSesion = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/iniciar-sesion'); //-- Al cerrar sesión nos lleva al login --
    })
}

//-- Genera un token si el usuario es válido --
exports.enviarToken = async (req, res) => {
    //-- Verificar que el usuario exista --
    const {email} = req.body;

    const usuario = await Usuarios.findOne({
        where: {
            email
        }
    });

    if(!usuario)
    {
        req.flash('error', 'No existe esa cuenta')
        res.redirect('/reestablecer');
        /*res.render('reestablecer', {
            title: 'Reestablecer tu contraseña',
            mensajes: req.flash()
        })*/
    }
    
    //-- El usuario existe --
    usuario.token = crypto.randomBytes(20).toString('hex');
    //-- Generar la Expiración --
    usuario.expiracion = Date.now() + 3600000;

    //-- Guardarlos en la base de datos --
    await usuario.save();

    //-- url de reset --
    const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`;

    //-- Envía el correo con el token --
    await enviarEmail.enviar({
        usuario,
        subject: 'Password reset',
        resetUrl,
        archivo: 'reestablecer-password'
    });

    //-- Terminar --
    req.flash('correcto', 'Se envío un link de reestablecimiento a tu email')
    res.redirect('/iniciar-sesion');
}

exports.validarToken = async (req, res) => {
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token
        }
    });

    //-- Sino encuentra el usuario --
    if(!usuario)
    {
        req.flash('error', 'No válido');
        res.redirect('/reestablecer');
    }
    
    //-- Formulario para generar el password --
    res.render('resetPassword', {
        title: 'Reestablecer contraseña'
    });

    console.log(usuario);
}

//-- Cambia el password por uno nuevo --
exports.actualizarPassword = async (req, res) => {

    //-- Verifica el token válido pero también la fecha de expiración --
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token,
            expiracion: {
                [Op.gte]: Date.now()
            }
        }
    });

    //-- Verificamos si el usuario existe --
    if(!usuario)
    {
        req.flash('error', 'No válido');
        res.redirect('/reestablecer');
    } 
    
    //-- Hashear el nuevo password --
    usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    usuario.token = null;
    usuario.expiracion = null;

    //-- Guardamos el nuevo password --
    await usuario.save();

    req.flash('correcto', 'Tu password se ha modificado correctamente');
    res.redirect('/iniciar-sesion');

}