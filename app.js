const express = require('express');
const app = express();
const Encriptaciones = require('./src/utils/GeneradorClaves.js');
const SqlConexion = require('./src/conexion/SQLConexion')
const port = 3000; 
const sql = require("mssql");
const morgan = require('morgan');
const path = require('path');
const messagesR = require("./routes/messages.route")
const usersR = require("./routes/users.route")
const session = require('express-session');
const bodyParser = require('body-parser');
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

io.on('connection', (socket) => {
  console.log('Nuevo usuario conectado');

  socket.on('disconnect', () => {
    console.log('Usuario desconectado');

  });
  socket.on('join', (data) => {
    const { sala } = data;
    socket.join(sala);

    console.log(`Usuario unido a la sala: ${sala}`);
  
  });

});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
  secret: 'akjshdaslkd35asdf45ads4a-aas36as5d65',
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 60 * 60 * 1000,//sesion de 1 hora
    secure: false,    
  }
}));
app.use(morgan('combined')); 

app.set('view engine', 'ejs');
app.use('/socketio',express.static(path.join(__dirname, 'node_modules/socket.io-client/dist')));
app.use('/js',express.static(path.join(__dirname, 'public/js')));
app.use('/css',express.static(path.join(__dirname, 'public/css')));
app.use('/jquery',express.static(path.join(__dirname, 'node_modules/jquery/dist')));
app.use('/sweet',express.static(path.join(__dirname, 'node_modules/sweetalert2/dist')));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Error interno del servidor');
});

// Rutas
app.use(messagesR)
app.use(usersR)

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
    EXEC insertarMensaje
      @remitente_id = ${remitente_id},
      @destinatario_id = ${receptor_id},
      @mensaje = ${mEncriptado},
      @tipo = 1
    `;
    await sql.query`
    EXEC insertarMensaje
      @remitente_id = ${remitente_id},
      @destinatario_id = ${receptor_id},
      @mensaje = ${mEncriptadoLocal},
      @tipo = 2
    `;
    const segs = Date.now()
    io.to(remitente_id).emit('nuevo-mensaje', {
      mensaje: mensaje,
      sala : remitente_id,
      tiempo : segs
    });
  } catch (error) {
    console.error('Error al ingresar el mensaje:', error);
    res.status(500).send('Error al ingresar el mensaje');
  } finally {
    await sql.close();
  }
});

server.listen(3000, () => {
  console.log('Servidor en ejecución en el puerto 3000');
});