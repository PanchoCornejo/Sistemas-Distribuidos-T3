CREATE KEYSPACE IF NOT EXISTS medicina2 WITH REPLICATION = { 'class' : 'SimpleStrategy', 'replication_factor' : '3' };


CREATE TABLE IF NOT EXISTS medicina2.recetas (
id int PRIMARY KEY,
id_paciente int,
comentario text,
farmacos text,
doctor text
);


INSERT INTO medicina2.recetas
(id, id_paciente, comentario, farmacos, doctor)
VALUES ( 1, 1, 'Amigdalitis', 'Paracetamol', 'Jaime');

INSERT INTO medicina2.recetas
(id, id_paciente, comentario, farmacos, doctor)
VALUES ( 2, 2, 'Diarrea', 'Aguita de menta', 'Mendoza');

INSERT INTO medicina2.recetas
(id, id_paciente, comentario, farmacos, doctor)
VALUES ( 3, 3, 'Resfrio', 'Unoaldia', 'Zalazar');