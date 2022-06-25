CREATE KEYSPACE IF NOT EXISTS medicina WITH REPLICATION = { 'class' : 'SimpleStrategy', 'replication_factor' : '2' };

CREATE TABLE IF NOT EXISTS medicina.paciente (
id int PRIMARY KEY,
nombre text,
apellido text,
rut text,
email text,
fecha_nacimiento text
);

INSERT INTO medicina.paciente
(id, nombre, apellido, rut, email, fecha_nacimiento)
VALUES ( 1, 'Pancho', 'Cornejo', '2012', 'kiwix@gmail.com', '23añosatras');

INSERT INTO medicina.paciente
(id, nombre, apellido, rut, email, fecha_nacimiento)
VALUES ( 2, 'Ignacio', 'Cornejo', '2013', 'igco@gmail.com', '17añosatras');

INSERT INTO medicina.paciente
(id, nombre, apellido, rut, email, fecha_nacimiento)
VALUES ( 3, 'Felipe', 'Cornejo', '2014', 'felipon@gmail.com', '23añosatras');