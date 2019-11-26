BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS `SensoresUsuarios` (
	`idUsuario`	TEXT NOT NULL,
	`idSensor`	INTEGER NOT NULL,
	FOREIGN KEY(`idUsuario`) REFERENCES `Usuarios`(`idUsuario`) ON DELETE CASCADE,
	PRIMARY KEY(`idUsuario`,`idSensor`),
	FOREIGN KEY(`idSensor`) REFERENCES `Sensores`(`idSensor`) on delete cascade
);
INSERT INTO `SensoresUsuarios` VALUES ('briancalabuig@gmail.com',1);
INSERT INTO `SensoresUsuarios` VALUES ('canut@gmail.com',3);
INSERT INTO `SensoresUsuarios` VALUES ('a@gmail.com',2);
CREATE TABLE IF NOT EXISTS `Sensores` (
	`idSensor`	INTEGER,
	`idTipoSensor`	INTEGER,
	`descripcion`	TEXT,
	FOREIGN KEY(`idTipoSensor`) REFERENCES `TipoSensor`(`idTipoSensor`),
	PRIMARY KEY(`idSensor`)
);
INSERT INTO `Sensores` VALUES (1,1,NULL);
INSERT INTO `Sensores` VALUES (2,2,NULL);
INSERT INTO `Sensores` VALUES (3,3,NULL);
CREATE TABLE IF NOT EXISTS `Medidas` (
	`idMedida`	INTEGER PRIMARY KEY AUTOINCREMENT,
	`valorMedido`	INTEGER,
	`latitud`	REAL,
	`longitud`	REAL,
	`humedad`	INTEGER,
	`temperatura`	INTEGER,
	`tiempo`	BIGINT,
	`idTipoMedida`	INTEGER,
	`idUsuario`	TEXT,
	`idSensor`	INTEGER,
	FOREIGN KEY(`idTipoMedida`) REFERENCES `TipoSensor`(`idTipoSensor`),
	FOREIGN KEY(`idSensor`) REFERENCES `Sensores`(`idSensor`) on delete set null,
	FOREIGN KEY(`idUsuario`) REFERENCES `Usuarios`(`idUsuario`) on delete set null
);
COMMIT;
