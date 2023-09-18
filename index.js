const express = require('express');
//importamos nuestras rutas
const routerApi = require('./routes');
const app = express();
//habilitamos el middleware
app.use(express.json());

app.get('/',(req,res)=>{
    res.status(200).send('<h1>Bienvenidos</h1><br><a href="/alumnos">Lista de Alumnos</a>');
})
//llamamos a nuestras rutas
routerApi(app);

const port = 2023;
//Escuchar el puerto
app.listen(port, () => {
    console.log(`El servidor esta escuchando el puerto ${port}`);
});