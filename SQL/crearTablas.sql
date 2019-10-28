CREATE TABLE Medidas (idMedida INTEGER PRIMARY KEY AUTOINCREMENT, idTipoMedida REFERENCES TipoSensores (idTipoMedida)
    ON DELETE SET NULL ONUPDATE CASCADE,
         valorMedido INTEGER,
         tiempo BIGINT,
         latitud REAL,
         longitud REAL,
         idUsuario INTEGER REFERENCES Usuarios (idUsuario)
    ON DELETE SET NULL ONUPDATE CASCADE); 

    /* Crear tabla Sensores */
     CREATE TABLE Sensores (idSensor INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
         idTipo INTEGER REFERENCES TipoSensores (idTipoMedida)
    ON DELETE SET NULL
    ONUPDATE CASCADE, descripcion TEXT);

     /* Crear tipo Sensores */ 
     CREATE TABLE TipoSensores (idTipoMedida INTEGER PRIMARY KEY AUTOINCREMENT, descripcion TEXT);

     /* Crear Tipo Usuarios */ 
     CREATE TABLE TipoUsuario (idTipo INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, Descripcion TEXT);
     
      /* Crear UsuarioSensor */ 
      CREATE TABLE UsuarioSensor (idUsuario INTEGER REFERENCES Usuarios (idUsuario)
    ON DELETE SET NULL,
         idSensor INTEGER REFERENCES Sensores (idSensor)
    ON DELETE SET NULL,
         idUsuarioSensor INTEGER PRIMARY KEY
    ON CONFLICT ROLLBACK AUTOINCREMENT NOT NULL);

    /* Crear Usuarios */
    CREATE TABLE Usuarios (idUsuario INTEGER PRIMARY KEY NOT NULL, email VARCHAR (50), password VARCHAR (10) NOT NULL, telefono VARCHAR (9), idTipoUsuario INTEGER REFERENCES TipoUsuario (idTipo) ON DELETE SET NULL NOT NULL);
