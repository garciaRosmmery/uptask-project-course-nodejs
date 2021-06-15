const Usuarios = require('../models/Usuarios');
const enviarEmail = require('../handlers/email');

exports.formCrearCuenta = (req, res) => {
    res.render('crearCuenta', {
        title: 'Crear cuenta en UpTask'
    })
}

exports.formIniciarSesion = (req, res) => {
    console.log(res.locals.mensajes);
    const {error} = res.locals.mensajes;
    res.render('iniciarSesion', {
        title: 'Iniciar sesión en UpTask',
        error
    })
}

exports.crearCuenta = async (req, res) => {
    //-- Leer los datos --
    const {email, password} = req.body;

    try {
        //-- Crear el usuario --
        const respuesta = await Usuarios.create({
            email,
            password
        });

        //-- Crear una URL de confirmación --
        const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`;

        //-- Crear el objeto de usuario --
        const usuario = {
            email
        }

        //-- Enviar email --
        await enviarEmail.enviar({
            usuario,
            subject: 'Confirma tu cuenta UpTask',
            confirmarUrl,
            archivo: 'confirmar-cuenta'
        });
        
        //-- Redirigir al usuario --
        req.flash('correcto', 'Enviamos un correo, confirma tu cuenta')
        res.redirect('/iniciar-sesion');
        
    } catch (error) {
        req.flash('error', error.errors.map(error => error.message))
        res.render('crearCuenta', {
            title: 'Crear cuenta en UpTask',
            mensajes: req.flash(),
            email,
            password
        })
    }
}

//-- 
exports.formReestablecerPassword = (req, res) => {
    res.render('reestablecer', {
        title: 'Reestablecer tu contraseña'
    })
}

exports.confirmarCuenta = async (req, res) => {
    
    const usuario = await Usuarios.findOne({
        where: {
            email: req.params.email
        }
    });

    //-- Si no existe el usuario --
    if(!usuario)
    {
        req.flash('error', 'No válido');
        res.redirect('crear-cuenta');
    }

    usuario.activo = 1;
    await usuario.save();

    req.flash('correcto', 'Cuenta activada correctamente');
    res.redirect('/iniciar-sesion');
}