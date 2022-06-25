# Sistemas-Distribuidos
Tarea 2 del Ramo


## Funcionamiento de la APP
Para correr la tarea se requiere contar con nodejs

Dependencias Utilizadas en mi caso utilize  npm:

`npm install express espress-session cassandra-driver nodemon`

Se requiere correr el docker-compose para eso se ejecuta:

`sudo docker-compose up`

(Para este caso mi notebook no fue capaz de trabajar con 3 nodos de Cassandra por lo que cree una maquina virtual con 8 nucleos y 16 gb de ram que tampoco fue capaz por lo que trabaje solo con 1 nodo de cassandra de todas formas realize el codigo para que sea distribuido como se solicita colocando el factor de replicacion correspondiente en cada keyspace que mas adelante nombrare. Los cuales se encargan de la replicacion automaticamente entre los nodos que se conecten)

Luego para utilizar cassandra se requiere conseguir la ip correspondiente a esta para esto uno ejecuta:

`sudo docker ps`

que nos listara las imagenes que estamos corriendo, luego anotamos la id de el servicio cassandra en bitnami y ejecutamos el codigo (Recomiendo el nodo1):

`sudo docker inspect "ID"`

buscamos la IP y la copiamos para luego pegarla en /src index.js donde se reemplaza por contactPoints 
![no carga la imagen](https://media.discordapp.net/attachments/878099236334485504/990127824033701978/ips.png)

corremos en la consola de comando que envuelve todo, estos 2 comandos para crear los keyspaces usados (donde se crean 2 para la forma distribuida):

`sudo docker exec -it "ID" bash`

Recomiendo este sieguientte comando escribir a mano ya que copiar y pegarlo no lo detecta bien

`cqlsh --usaername cassandra --password cassandra`

Luego dentro de cqlsh se copiara y pegara los archivos en /db pacientes.cql y recetas.cql y creara los keyspace necesarios para esto. (Donde los keyspaces traen la forma de distribuicion entre los nodos)

para revisar que se crearon correctamente se puede realizar un 

`SELECT * FROM medicina2.recetas`

![no carga la imagen](https://media.discordapp.net/attachments/878099236334485504/990131112502259752/ejemplo.png)

 Luego se guarda los cambios y ya se puede trabajar con la Api corriendo 
 
`npm start`

Y estara listo para recibir peticiones insomnia o postman.

## Realizar /create

Para esto se utilizara postman en el metodo post en localhost:3000/create donde creara un nuevo paciente y receta si no existe y en caso de existir remplazara los datos de receta, donde como ejemplo 
```
{
    "nombre": "Melon",
    "apellido": "Musk",
    "rut": "444",
    "email": "melon@gmail.com",
    "fecha_nacimiento": "hacerato",
    "comentario": "Gonorrea",
    "farmacos": "Pastillitas",
    "doctor": "ursula"
}
```
## Realizar /edit

Para esto se utilizara postman en el metodo post en localhost:3000/edit donde buscara por id y modificara los datos de receta si esta id existe, donde como ejemplo 
```
{
    "id": 3,
    "comentario": "Amigdalitis Aguda",
    "farmacos": "paracetamol con aguita",
    "doctor": "japones"
}
```

## Realizar /delete

Para esto se utilizara postman en el metodo post en localhost:3000/delete donde buscara por id y eliminara los datos de receta si esta id existe, donde como ejemplo 
```
{
    "id": 3
}
```

## Preguntas

**1.** Explique la arquitectura que Cassandra maneja. Cuando se crea el cluster ¿Como los nodos se conectan? ¿Que
ocurre cuando un cliente realiza una peticion a uno de los nodos? ¿Que ocurre cuando uno de los nodos se desconecta?
¿La red generada entre los nodos siempre es eficiente? ¿Existe balanceo de carga?

Cassandra esta hecho para un espacio distribuido y los nodos estan en un protocolo P2P donde todos los nodos cambian informacion de forma continua, los nodos se conectan uno con otros a travez de p2p y cuando un cliente se conecta a realizar una peticion puede conectarse a cualquiera de estos nodos y realizar su peticion , donde este nodo actuara como coordinador y solocitara a otros nodos el evio de informacion. 
Como cassandra tiene un metodo de replicacion de los datos a travez de sus keyspaces varios nodos contienen la informacion por lo que si llega a caer uno de estos la infomacion seguira intacta en otro nodo donde el cordinador buscara la informacion en otro nodo y el nodo caido puedo volver a un funcionamiento normal despues de un tiempo de gracia y recuperar su informacion.  La red generada entre los nodos no siempre es eficiente ya que demora en realizar una replicacion de los datos y no puede generar orden mientras hay solicitudes. Si esiste Balanceo de carga gracias a los keyspaces y los nodos ya que se replican los datos y el nodo corrdinador puede preguntar a varios nodos por la informacion que se solicita. 

**2.** Cassandra posee principalmente dos estrategias para mantener redundancia en la replicacion de datos. ¿Cuales son
estos? ¿Cual es la ventaja de uno sobre otro? ¿Cual utilizarıa usted para en el caso actual y por que? Justifique
apropiadamente su respuesta.

SimpleStrategy y NetworkTopologyStrategy
SimpleStrategy esta enfocado a un centro de datos o cluster por lo que todos los nodos se encuentran ahi para una implementacion mas simple y rapida. En cambio NetworkTopologyStrategy se enfoca en un siustema distribuido de gran escala donde habra distintos centros dedatos con sus nodos, por lo qie es altamente recomendado para la mayoría de las implementaciones porque es mucho más fácil expandirse a múltiples centros de datos cuando lo requiera una futura expansión.
Para el caso actual y tomando en cuenta que el ejemplo de esta tarea es simple y con solamente 2 keyspace y para una api que realiza la creacion edicion y eleminicacion de datos utilizaria SimpleStrategy ya que hablamos de algo pequeño que se sabe que no se expandira a una gran escala

**3.** Teniendo en cuenta el contexto del problema ¿Usted cree que la solucion propuesta es la correcta? ¿Que ocurre
cuando se quiere escalar en la solucion? ¿Que mejoras implementarıa? Oriente su respuesta hacia el Sharding (la
replicacion/distribucio de los datos) y comente una estrategia que podrıa seguir para ordenar los datos.

El problema tiene una solucion correcta ya que es un sistema muy pequeño que no se pienza escalar de forma gigante por lo que si se requiere escalar mas esta solucion pueden impementarse mas nodos dentro de esta red del cluster para que cada keyspace como "minimo" tenga 3 replicaciones entre los nodos ya que contar solo con 2 lleva a una poca confiabilidad de los datos ya que una caida y contar solo con un nodo disponible para el keyspace puede traer problemas y sobrecargas a ese nodo. Tambien se tendria que aumentar la cantidad de keyspaces si se solicitan mas funciones en la api , para ordenar los datos tener mas tablas con keyspaces se puede lograr una ordenacion de datos ya que estarian mucho mas libre cuando se soliciten los datos al tener mas de estos ya que si sobrecargan uno no podrar realizar orden como se describe en las debilidades de cassandra. Por lo que se puede notar que en cassandra la gran ayuda que tiene es la replicacion de los datos.
