create database MensajeriaRSA
go
use MensajeriaRSA
go
CREATE TABLE usuarios (
    id INT identity PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
	username VARCHAR(255) NOT NULL,
	contrasena text NOT NULL,
    clave_privada TEXT NOT NULL,
    clave_publica TEXT NOT NULL,
    isadmin BIT NOT NULL
);
go
CREATE TABLE TipoMensaje(
    id int NOT NULL,
    tipo VARCHAR(50)
)
INSERT INTO TipoMensaje VALUES(1,'Recibido'),(2,'Enviado')

go
CREATE TABLE Mensajes (
    id INT IDENTITY PRIMARY KEY,
    remitente_id INT NOT NULL,
    receptor_id INT NOT NULL,
    mensaje TEXT NOT NULL,
    tipo INT NOT NULL,
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
      @id_remitente int,
      @id_destinatario int
	  as
begin
	  select *  from mensajes where
	  (receptor_id = @id_destinatario and remitente_id = @id_remitente and tipo = 2)
	  or
	  (receptor_id = @id_remitente  and remitente_id=@id_destinatario and tipo = 1)
end
go
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
go

Create procedure insertarMensaje
      @remitente_id INT,
      @destinatario_id INT,
      @mensaje TEXT,
      @tipo INT
as
	 begin
	  insert into mensajes VALUES (@remitente_id,@destinatario_id,@mensaje,@tipo,GETDATE())
	 end

go
--CREACION DEL USUARIO
CREATE LOGIN "DEVUSER" WITH PASSWORD = 'DEVUSER987*';
go
CREATE USER "DEVUSER" FOR LOGIN "DEVUSER";
go
-- Para la tabla 'usuarios'
GRANT SELECT, INSERT, UPDATE, DELETE ON dbo.usuarios TO "DEVUSER";
go
-- Para la tabla 'mensajes'
GRANT SELECT, INSERT, UPDATE, DELETE ON dbo.mensajes TO "DEVUSER";
go
GRANT EXECUTE ON dbo.InsertarUsuario TO DEVUSER;
go
GRANT EXEC ON ExisteUsuario TO DEVUSER;
go
GRANT EXECUTE ON dbo.getMensajes TO DEVUSER;
go
GRANT EXECUTE ON dbo.insertarMensaje TO  DEVUSER;