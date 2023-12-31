const express = require('express');
const app = express();
const Encriptaciones = require('../src/utils/GeneradorClaves.js');
const SqlConexion = require('../src/conexion/SQLConexion')
const sql = require("mssql");
const bodyParser = require('body-parser');
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: {
   origin: "http://localhost:3000",
},
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json()); 

app.post('/cargar-mensajes', async (req, res) => {
  if(req.session.user==null){
    res.status(500).send('Error al cargar los mensajes');
  }else{
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
      io.emit('connection');
      res.status(200).json({ Mensajes: Tmensajes.recordset, idUsuario:req.session.user.id });;
    } catch (error) {
      console.error('Error al cargar los mensajes:', error);
      res.status(500).send('Error al cargar los mensajes');
    } finally {
      await sql.close();
    }
  }

});
app.get('/chats', async (req, res) => {
  if(req.session.user == null){
    res.redirect('/Login');
  }else{
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
  }
  
});
app.post('/get-decrypt', async (req,res)=>{
  if(req.session.user == null){
    res.status(401).send("No autorizado..");
  }else{
    try {
      const {msj} = req.body
      
      let Miclave = req.session.user
      Miclave =  Miclave.clave_privada
      MiclaveDesencriptada = await Encriptaciones.AesDecryptPass(Miclave);
      const mensajedes = await Encriptaciones.DesEncriptarMensaje(msj,MiclaveDesencriptada);

      console.log(mensajedes)
      res.status(200).json({msj : mensajedes}) 
    } catch (error) {
      console.error('Error al cargar a los usuarios: ', error);
      res.status(500).send('Error interno del servidor');
    }
  }
  
})
app.get('/obtener-id-usuario', (req, res) => {
  if (req.session.user) {
    res.json({ id: req.session.user.id});
  } else {
    res.status(401).json({ error: 'No autenticado' });
  }
});

module.exports = app