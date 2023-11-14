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
app.post('/cargar-mensajes', async (req, res) => {
  try {
    const { receptor_id } = req.body;
    const remitente_id = req.session.user.id;
    let Miclave = req.session.user
    Miclave =  Miclave.clave_privada
    MiclaveDesencriptada = await Encriptaciones.AesDecryptPass(Miclave);
    console.log('mi clave: '+MiclaveDesencriptada)
    await sql.connect(SqlConexion.config);
    const recibidos = await sql.query`
      SELECT * FROM mensajesRecibidos WHERE remitente_id = ${receptor_id} AND receptor_id = ${remitente_id};
    `;
    const enviados = await sql.query`
    SELECT * FROM mensajesEnviados WHERE remitente_id = ${remitente_id} AND receptor_id = ${receptor_id};
    `;
    
    for (let mensaje of recibidos.recordset) {
      mensaje.mensaje = await Encriptaciones.DesEncriptarMensaje(mensaje.mensaje, MiclaveDesencriptada);
    }

    for (let mensaje of enviados.recordset) {
      mensaje.mensaje = await Encriptaciones.DesEncriptarMensaje(mensaje.mensaje, MiclaveDesencriptada);
    }
    console.log(enviados);
    console.log(recibidos)
    res.status(200).send('Cargados');
  } catch (error) {
    console.error('Error al cargar los mensajes:', error);
    res.status(500).send('Error al cargar los mensajes');
  } finally {
    await sql.close();
  }
});

app.get('/chats', async (req, res) => {
  try {
    const username = req.session.user.username
    const result = await SqlConexion.getUsuarios(username);
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