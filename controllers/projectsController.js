const Proyectos = require('../models/Proyectos');
//const slug = require('slug');
const Tareas = require('../models/Tareas')

exports.projectsHome = async (req, res) => {

    const usuarioId = res.locals.usuario.id; 

    const proyectos = await Proyectos.findAll({
        where: {
            usuarioId
        }
    });

    res.render('index', {
        title: 'Proyectos',
        proyectos
    });
}
exports.formularioProyecto = async (req, res) => {

    const usuarioId = res.locals.usuario.id; 

    const proyectos = await Proyectos.findAll({
        where: {
            usuarioId
        }
    });

    res.render('nuevoProyecto', {
        title: 'Nuevo Proyecto',
        proyectos
    });
}
exports.nuevoProyecto = async (req, res) => {
    
    const usuarioId = res.locals.usuario.id; 

    const proyectos = await Proyectos.findAll({
        where: {
            usuarioId
        }
    });

    //-- Validar --
    const {nombre} = req.body;

    let errores = [];

    if(!nombre)
    {
        errores.push({'texto': 'Agrega un Nombre al Proyecto'});
    }

    if(errores.length > 0)
    {
        res.render('nuevoProyecto', {
            title: 'Nuevo Proyecto',
            errores: errores,
            proyectos
        });
    }else {
        //-- No hay errores --
        //-- Insertar en la BD --
        const usuarioId = res.locals.usuario.id; 
        //const url = slug(nombre).toLowerCase();
        const proyecto = await Proyectos.create({
            nombre,
            usuarioId
        });
        
        res.redirect('/');
        
    }

}

exports.proyectoPorUrl = async (req, res) => {

    const usuarioId = res.locals.usuario.id; 

    const proyectos = await Proyectos.findAll({
        where: {
            usuarioId
        }
    });
    //const proyectos = await Proyectos.findAll();

    const proyecto = await Proyectos.findOne({
        where: {
            url: req.params.url,
            usuarioId
        }
    });

    //-- Consultar tareas del proyecto actual --
    const tareas = await Tareas.findAll({
        where: {
            proyectoId: proyecto.id
        },
        /*include: [
            {
                model: Proyectos
            }
        ]*/
    });

    if(!proyecto) return next();

    //-- renderizo la vista --
    res.render('tareas', {
        title: 'Tareas del proyecto',
        proyecto,
        proyectos,
        tareas
    })
}

exports.formularioEditar = async (req, res) => {

    //-- Se recomienda usar await cuando la respuesta de una función depende de otra que se encuentra antes de ella --
    /*const proyectos = await Proyectos.findAll();
    const proyecto = await Proyectos.findOne({
        where: {
            id: req.params.id
        }
    })*/

    //-- Forma recomendada --
    const usuarioId = res.locals.usuario.id; 

    const proyectosPromise = Proyectos.findAll({
        where: {
            usuarioId
        }
    });
    //const proyectosPromise = Proyectos.findAll();

    const proyectoPromise = Proyectos.findOne({
        where: {
            id: req.params.id,
            usuarioId
        }
    });

    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);



    //-- render a la vista --
    res.render('nuevoProyecto', {
        title: 'Editar proyecto',
        proyectos,
        proyecto
    });
}

exports.actualizarProyecto = async (req, res) => {
    
    const usuarioId = res.locals.usuario.id; 

    const proyectos = await Proyectos.findAll({
        where: {
            usuarioId
        }
    });
    
    //-- Validar --
    const nombre = req.body.nombre;

    let errores = [];

    if(!nombre)
    {
        errores.push({'texto': 'Agrega un Nombre al Proyecto'});
    }

    if(errores.length > 0)
    {
        res.render('nuevoProyecto', {
            title: 'Nuevo Proyecto',
            errores: errores,
            proyectos
        });
    }else {
        //-- No hay errores --
        //-- Insertar en la BD --
        //const url = slug(nombre).toLowerCase();
        await Proyectos.update(
            { nombre: nombre }, 
            { where: { id: req.params.id }}
        );
        
        res.redirect('/');
        
    }

}

exports.eliminarProyecto = async (req, res, next) => {
    //-- req, query o params --
    const {urlProyecto} = req.query;

    const resultado = await Proyectos.destroy({
        where: {
            url: urlProyecto
        }
    })

    res.status(200).send('Proyecto eliminado conrrectamente');
}
