const express = require('express');
const session = require('express-session');
const { urlencoded } = require('express');
const cassandra = require('cassandra-driver');


//conexion con cassandra
let authProvider = new cassandra.auth.PlainTextAuthProvider('cassandra','cassandra');
const client = new cassandra.Client({
  contactPoints: ['172.22.0.2'],
  authProvider: authProvider,
  localDataCenter: 'datacenter1',
  keyspace: 'medicina'
});
const client2 = new cassandra.Client({
contactPoints: ['172.22.0.2'],
  authProvider: authProvider,
  localDataCenter: 'datacenter1',
  keyspace: 'medicina2'
});

const app = express()
const port = 3000

//middlewares
app.use(express.json());
app.use(express.urlencoded({extended: false}));



app.get('/db', async (req, res) => {
  let query = 'SELECT * FROM medicina2.recetas';
  let q1 = client2.execute(query).then(result => {console.log('Los datos son: \n'+ result.rows[0].comentario);}).catch((err) => {console.log(' Error en encontrar la wea\n', err);}); 
  //console.log('\nLos datos son: \n'+ q1)   
})

app.post('/create', async (req, res) => {
  const nombre = req.body.nombre;
  const apellido = req.body.apellido;
  const rut = req.body.rut;
  const email = req.body.email;
  const fecha_nacimiento = req.body.fecha_nacimiento;
  const comentario = req.body.comentario;
  const farmacos = req.body.farmacos;
  const doctor = req.body.doctor;
  var id = 4;
  var idr= 4;
  // Buscar si el paciente existe
  let busqueda = 'SELECT id FROM medicina.paciente WHERE rut=? ALLOW FILTERING'
  console.log('\nRut que estamos buscando: '+ rut)
  let idb = await client.execute(busqueda,[rut],{ prepare: true }).then(result => {console.log('Encontramos el id en aquel rut \n'+ result.rows[0].id);return result.rows[0].id}).catch((err) => {console.log('No se encontro el id en ese rut\n');});
  console.log('\nContenido de idb:'+ idb)
  if(idb){
    //existe por lo que hay que modificar su receta
    let modificacion = 'UPDATE medicina2.recetas SET comentario=? , farmacos=? , doctor=? WHERE id=?'
    let idmodificar = 'SELECT id FROM medicina2.recetas WHERE id_paciente=? ALLOW FILTERING'
    let pregunta = await client.execute(idmodificar,[idb],{ prepare: true }).then(result => {console.log('Encontramos el id \n'+ result.rows[0].id);return result.rows[0].id}).catch((err) => {console.log('No se encontro el id\n');});
    console.log('Updatearemos el id:'+ pregunta)
    let q3 = client.execute(modificacion,[comentario,farmacos,doctor,pregunta],{ prepare: true }).then(result => {console.log('Datos Actualizados en recetas... \n');}).catch((err) => {console.log(' Error en Actualizar en recetas\n', err);});
  } else{
    // usuario nuevo
    let query = 'INSERT INTO medicina.paciente (id, nombre, apellido, rut, email, fecha_nacimiento) VALUES ( ?, ?, ?, ?, ?, ?)'
    let q1 = client.execute(query,[id,nombre,apellido,rut,email,fecha_nacimiento],{ prepare: true }).then(result => {console.log('Datos Guardados en pacientes... \n');}).catch((err) => {console.log(' Error en Guardar en pacientes\n', err);});
    let query2 = 'INSERT INTO medicina2.recetas (id, id_paciente, comentario, farmacos, doctor) VALUES ( ?, ?, ?, ?, ?)'
    let q2 = client2.execute(query2,[idr,id,comentario,farmacos,doctor],{ prepare: true }).then(result => {console.log('Datos Guardados en recetas... \n');}).catch((err) => {console.log(' Error en Guardar en recetas\n', err);});
  }
  
})

app.post('/edit', async (req, res) => {
  const id = req.body.id;
  const comentario = req.body.comentario;
  const farmacos = req.body.farmacos;
  const doctor = req.body.doctor;
  //buscar si existe
  let busqueda = 'SELECT id FROM medicina2.recetas WHERE id=? ALLOW FILTERING'
  let idb = await client.execute(busqueda,[id],{ prepare: true }).then(result => {console.log('Encontramos el id \n'+ result.rows[0].id);return result.rows[0].id}).catch((err) => {console.log('No se encontro el id\n');});
  console.log('\nContenido de id:'+ idb)
  if(idb){
    //existe para modificar
    let modificacion = 'UPDATE medicina2.recetas SET comentario=? , farmacos=? , doctor=? WHERE id=?'
    let q3 = client.execute(modificacion,[comentario,farmacos,doctor,id],{ prepare: true }).then(result => {console.log('Datos Actualizados en recetas... \n');}).catch((err) => {console.log(' Error en Actualizar en recetas\n', err);});
  } else{
    console.log('No existe esta receta para modificar')
  }

})

app.post('/delete', async (req, res) => {
  const id = req.body.id;
  //buscar si existe
  let busqueda = 'SELECT id FROM medicina2.recetas WHERE id=? ALLOW FILTERING'
  let idb = await client.execute(busqueda,[id],{ prepare: true }).then(result => {console.log('Encontramos el id \n'+ result.rows[0].id);return result.rows[0].id}).catch((err) => {console.log('No se encontro el id\n');});
  console.log('\nContenido de id:'+ idb)
  if(idb){
    //existe para modificar
    let modificacion = 'DELETE FROM medicina2.recetas WHERE id=?'
    let q3 = client.execute(modificacion,[id],{ prepare: true }).then(result => {console.log('Datos borrados en recetas... \n');}).catch((err) => {console.log(' Error en borrar en recetas\n', err);});
  } else{
    console.log('No existe esta receta para borrar')
  }
})




app.listen(port, () => {
    console.log(`Escuchando la app en http://localhost:${port}`)
  })