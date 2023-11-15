const express = require('express');
const app = express();
const Encriptaciones = require('../src/utils/GeneradorClaves.js');
const SqlConexion = require('../src/conexion/SQLConexion')
const sql = require("mssql");
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');
const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: {
   origin: "http://localhost:3000", //specific origin you want to give access to,
},
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json()); 

app.post('/cargar-mensajes', async (req, res) => {
  try {
    const { receptor_id } = req.body;
    const remitente_id = req.session.user.id;
    let Miclave = req.session.user
    Miclave =  Miclave.clave_privada
    MiclaveDesencriptada = await Encriptaciones.AesDecryptPass(Miclave);
    await sql.connect(SqlConexion.config);
    const Tmensajes = await sql.query`
    EXEC getMENSAJES
      @id_remitente = ${remitente_id},
      @id_destinatario = ${receptor_id}
    `;

    for (let mensaje of Tmensajes.recordset) {
      mensaje.mensaje = await Encriptaciones.DesEncriptarMensaje(mensaje.mensaje, MiclaveDesencriptada);
    }

    console.log(Tmensajes.recordset)
    io.emit('connection');
    res.status(200).json({ Mensajes: Tmensajes.recordset, idUsuario:req.session.user.id });;
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
app.get('/obtener-id-usuario', (req, res) => {
  if (req.session.user) {
    res.json({ id: req.session.user.id});
  } else {
    res.status(401).json({ error: 'No autenticado' });
  }
});

module.exports = app