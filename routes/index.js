//Importamos las rutas
const alumnos = require('./alumnos');

//Funcion recibe la aplicacion como parametro de entrada

function routerApi(app){
    app.use('/alumnos',alumnos);
}
//exportamos la funcion 
module.exports=routerApi;

