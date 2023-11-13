const express = require('express');
const app = express();
const Encriptaciones = require('../src/utils/GeneradorClaves.js');
const SqlConexion = require('../src/conexion/SQLConexion')
const sql = require("mssql");
const bodyParser = require('body-parser');
const path = require('path');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.post('/ingresar-mensaje', async (req, res) => {
  try {
    const { receptor_id, mensaje } = req.body;
    const remitente_id = req.session.user.id;
    const keyReceptor = await SqlConexion.getUsuarioKey(receptor_id);
    let Miclave = req.session.user
    Miclave =  Miclave.clave_publica

    const mEncriptado = await Encriptaciones.EncriptarMensaje(mensaje, keyReceptor);
    const mEncriptadoLocal = await Encriptaciones.EncriptarMensaje(mensaje,Miclave);

    await sql.connect(SqlConexion.config);
    await sql.query`
      INSERT INTO mensajesRecibidos (remitente_id, receptor_id, mensaje)
      VALUES (${remitente_id}, ${receptor_id}, ${mEncriptado});
    `;
    await sql.query`
      INSERT INTO mensajesEnviados (remitente_id, receptor_id, mensaje)
      VALUES (${remitente_id}, ${receptor_id}, ${mEncriptadoLocal});
    `;
    res.send('Enviado');
  } catch (error) {
    console.error('Error al ingresar el mensaje:', error);
    res.status(500).send('Error al ingresar el mensaje');
  } finally {
    await sql.close();
  }
});


app.get('/chats', async (req, res) => {
  try {
    //const username = req.session.user.username
    const result = await SqlConexion.getUsuarios('nbelen');
    res.render('messages/chat', {
      usuarios: result, 
      mensaje : 'Inicio de sesion existoso',
    });
  } catch (error) {
    console.error('Error al cargar a los usuarios: ', error);
    res.status(500).send('Error interno del servidor');
  }
});

module.exports = app