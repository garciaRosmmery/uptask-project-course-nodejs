//-- Esta es la forma de importar con ECMAScript 6 pero aún no es soportado por default, hay que habilitarla --
//import express from 'express';

//-- Configuro un servidor de express --
const express = require('express'); //-- Express soporta esta sintaxis --
const router = express.Router();

//-- Importar express validator --
const { body } = require('express-validator/check');
//-- Importo el controlador --
const projectsController = require('../controllers/projectsController');
const tareasController = require('../controllers/tareasController');
const usuariosController = require('../controllers/usuariosController');
const authController = require('../controllers/authController');

module.exports = () => {

    router.get('/',
        authController.usuarioAutenticado,
        projectsController.projectsHome);
    router.get('/nuevo-proyecto',
        authController.usuarioAutenticado,
        projectsController.formularioProyecto);

    router.post('/nuevo-proyecto',
        authController.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(),
        projectsController.nuevoProyecto);

    //-- Listar proyecto --
    router.get('/proyectos/:url',
        authController.usuarioAutenticado,
        projectsController.proyectoPorUrl);

    //-- Actualizar el proyecto --
    router.get('/proyecto/editar/:id',
        authController.usuarioAutenticado,
        projectsController.formularioEditar);

    router.post('/nuevo-proyecto/:id',
        authController.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(),
        projectsController.actualizarProyecto);

    //-- Eliminar un proyecto --
    router.delete('/proyectos/:url',
        authController.usuarioAutenticado,
        projectsController.eliminarProyecto);

    //-- Tareas --
    router.post('/proyectos/:url',
        authController.usuarioAutenticado,
        tareasController.agregarTarea);

    //-- Actualizar tarea --
    router.patch('/tareas/:id',
        authController.usuarioAutenticado,
        tareasController.cambiarEstadoTarea);

    //-- Eliminar tarea --
    router.delete('/tareas/:id',
        authController.usuarioAutenticado,
        tareasController.eliminarTarea);

    //-- Crear nueva cuenta --
    router.get('/crear-cuenta', usuariosController.formCrearCuenta);
    router.post('/crear-cuenta', usuariosController.crearCuenta);

    //-- Iniciar sesión --
    router.get('/iniciar-sesion', usuariosController.formIniciarSesion);
    router.post('/iniciar-sesion', authController.autenticarUsuario);
    router.get('/confirmar/:email', usuariosController.confirmarCuenta);

    //-- Cerrar sesión --
    router.get('/cerrar-sesion', authController.cerrarSesion);

    //-- Reestablecer contraseña --
    router.get('/reestablecer', usuariosController.formReestablecerPassword);

    router.post('/reestablecer', authController.enviarToken);
    router.get('/reestablecer/:token', authController.validarToken);
    router.post('/reestablecer/:token', authController.actualizarPassword);

    return router;
}




//-- Crear una app --
/*const app = express();
//-- Rutas para el home --
app.use('/', (req, res) => { //-- .use va a leer cualquier verbo HTTP --
    //-- res.send es la respuesta más básica, res.render es para mostrar HTML - vistas, 
    res.send('Hola!'); //-- En una REST API se recomienda utilizar .json() para devolver la respuesta como json. La ventaja es que se puede consumir en otros proyectos de Angular, Vue, React o cualquier otro. Se puede acceder a datos desde otra aplicaión -- 
})
//-- Indicar por qué puerto va a escuchar --
app.listen(3000);*/