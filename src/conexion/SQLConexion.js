const sql = require("mssql");

const config = {
  user: "DEVUSER",
  password: "DEVUSER987*",
  server: "DESKTOP-AIHOTLI",
  database: "MensajeriaRSA",
  options: {
    encrypt: true, 
    trustServerCertificate: true,
  },
};

async function conectar() {
    try {
      await sql.connect(config);
      console.log('Conexión establecida correctamente.');
    } catch (error) {
      console.error('Error al conectar a la base de datos:', error);
    }
}

async function insertarUsuario(nombre, username, contrasena, clavePrivada, clavePublica, isAdmin) {
  try {
    await sql.connect(config);

    const result = await sql.query(`
      EXEC InsertarUsuario
        @nombre = '${nombre}',
        @username = '${username}',
        @contrasena = '${contrasena}',
        @clave_privada = '${clavePrivada}',
        @clave_publica = '${clavePublica}',
        @isadmin = ${isAdmin ? 1 : 0}
    `);

    console.log('Usuario insertado correctamente:', result);
  } catch (error) {
    console.error('Error al insertar usuario:', error);
    throw error;
  } finally {
    await sql.close();
  }
}

async function getUsuarios(username) {
  try {
    await sql.connect(config);
    const result = await sql.query`
      SELECT id, nombre, username 
      FROM usuarios
      WHERE username != ${username}
    `;
    return result.recordset;
  } catch (error) {
    throw error;
  } finally {
    await sql.close();
  }
}


async function ExisteUsuario(username) {
  try {
    await sql.connect(config);

    const result = await sql.query(`
      Select from ExisteUsuario
        @username = '${username}',
    `);

    console.log('Usuario insertado correctamente:', result);
  } catch (error) {
    console.error('Error al insertar usuario:', error);
    throw error;
  } finally {
    await sql.close();
  }
}
module.exports = {insertarUsuario,ExisteUsuario,getUsuarios}