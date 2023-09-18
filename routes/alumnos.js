const express = require('express');
const fs = require('fs').promises;
const router = express.Router();
const path = './data/alumnos.json';


router.get('/', async(req,res)=>{
    try{
        const data = JSON.parse( await fs.readFile(path, 'utf-8'));
        const html =`
                <h1>Listado de Alumnos</h1>
                <ul>
                    ${data.map(alumno => `<li>Nombre: ${alumno.nombre}</li>
                    <li><a href="/alumnos/${alumno.legajo}"> Ver alumno </a></li>`).join('')}
            </ul>
        `;
        res.send(html);
    }catch(err){
        console.error(err);
        res.status(500).json({ error: 'Error al leer la lista de alumnos.' });
        return;
    }
    
})

//Mostrar alumno por legajo
router.get('/:legajo',async (req,res)=>{
  
    try{
        const legajo = req.params.legajo;
        const data = JSON.parse( await fs.readFile(path, 'utf-8'));
        const alumno = data.find(alum => alum.legajo === legajo);
        res.json({
            msg:alumno? 'Detalle de alumno' : 'Alumno no encontrado', 
            data: alumno ? alumno : {} ,
        })

    }catch(error){
        res.json({
            msg: 'Error en el Servidor '   
        });
    }
})

//Agregar un nuevo alumno
router.post('/', async function(req,res) {
    try{   
        const alumnosList = JSON.parse( await fs.readFile(path , 'utf-8'));
        const alumno = req.body;

        alumnosList.push(alumno);
        await fs.writeFile(path, JSON.stringify(alumnosList, null, 2), 'utf-8');
        res.json({
            msg:'Alumno guardado',
            data:alumno,
        })
    } catch(e){
        res.json({
            msg: 'Error en el Servidor '   
        });
    }
});

//Modificar los datos de un alumno
router.put('/:legajo', async(req,res)=>{
    try{
        const alumnosList = JSON.parse( await fs.readFile(path , 'utf-8'));
        const { legajo } = req.params;
        const alumno = req.body;
        const modificarAlumno = alumnosList.map (a =>{
            if(a.legajo == legajo ){
                return{
                    legajo: legajo,
                    nombre: alumno.nombre || a.nombre,
                    apellido: alumno.apellido || a.apellido,
                    anio: alumno.anio || a.anio

                }
            }else{
                return a;
            }
        })
        await fs.writeFile(path, JSON.stringify(modificarAlumno, null, 2));
        res.json({
            msg:"Datos actualizados",
            data:alumno,
        })
    }catch(e){
        res.json({
            msg : "No se pudo modificar"
        })
    }
})
//Eliminar por numero de legajo
router.delete('/:legajo', async (req, res) => {
    try {
        const { legajo } = req.params;
        const alumnoList = JSON.parse(await fs.readFile(path, 'utf-8'));
        const actualizarLista = alumnoList.filter(alumno => alumno.legajo !== legajo);

        if (alumnoList.length === actualizarLista.length) {
            return res.status(404).json({
                msg: "Alumno no encontrado"
            });
        }

        await fs.writeFile(path, JSON.stringify(actualizarLista, null, 2), 'utf-8');
        res.json({
            msg: "Alumno eliminado correctamente"
        });
    } catch (e) {
        res.json({
            msg: "No se pudo eliminar el alumno"
        });
    }
});

module.exports = router;
