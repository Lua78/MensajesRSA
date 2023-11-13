create database MensajeriaRSA

use MensajeriaRSA
CREATE TABLE usuarios (
    id INT identity PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
	username VARCHAR(255) NOT NULL,
	contrasena text NOT NULL,
    clave_privada TEXT NOT NULL,
    clave_publica TEXT NOT NULL,
    isadmin boolean NOT NULL
);

CREATE TABLE mensajesEnviados (
    id INT IDENTITY PRIMARY KEY,
    remitente_id INT NOT NULL,
    receptor_id INT NOT NULL,
    mensaje TEXT NOT NULL,
    fecha_envio DATETIME DEFAULT GETDATE()
);
CREATE TABLE mensajesRecibidos (
    id INT IDENTITY PRIMARY KEY,
    remitente_id INT NOT NULL,
    receptor_id INT NOT NULL,
    mensaje TEXT NOT NULL,
    fecha_envio DATETIME DEFAULT GETDATE()
);

GO

CREATE FUNCTION dbo.ExisteUsuario(@nombreUsuario VARCHAR(255))
RETURNS BIT
AS
BEGIN
    DECLARE @UsuarioExistente BIT;

    SELECT @UsuarioExistente = CASE WHEN COUNT(*) > 0 THEN 1 ELSE 0 END
    FROM usuarios
    WHERE username = @nombreUsuario;

    RETURN @UsuarioExistente;
END;

GO
CREATE PROCEDURE getMENSAJES
    @emisor_username VARCHAR(255),
    @receptor_username VARCHAR(255)
AS
BEGIN
    SELECT id, remitente_username, receptor_username, mensaje, fecha_envio
    FROM mensajes
    WHERE (remitente_username = @emisor_username AND receptor_username = @receptor_username)
       OR (remitente_username = @receptor_username AND receptor_username = @emisor_username)
    ORDER BY fecha_envio;
END;
GO
CREATE PROCEDURE InsertarUsuario
    @nombre VARCHAR(255),
    @username VARCHAR(255),
    @contrasena TEXT,
    @clave_privada TEXT,
    @clave_publica TEXT,
    @isadmin BIT
AS
BEGIN
    INSERT INTO usuarios (nombre, username, contrasena, clave_privada, clave_publica, isadmin)
    VALUES (@nombre, @username, @contrasena, @clave_privada, @clave_publica, @isadmin);
END;


--CREACION DEL USUARIO
CREATE LOGIN "DEVUSER" WITH PASSWORD = 'DEVUSER987*';
CREATE USER "DEVUSER" FOR LOGIN "DEVUSER";

-- Para la tabla 'usuarios'
GRANT SELECT, INSERT, UPDATE, DELETE ON dbo.usuarios TO "DEVUSER";
-- Para la tabla 'mensajes'
GRANT SELECT, INSERT, UPDATE, DELETE ON dbo.mensajes TO "DEVUSER";
GRANT EXECUTE ON dbo.InsertarUsuario TO DEVUSER;
GRANT EXEC ON ExisteUsuario TO DEVUSER;


