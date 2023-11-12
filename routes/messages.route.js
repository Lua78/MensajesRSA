const express = require('express');
const app = express();
const Encriptaciones = require('../src/utils/GeneradorClaves.js');
const SqlConexion = require('../src/conexion/SQLConexion')
const bodyParser = require('body-parser');
const path = require('path');
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/Mensaje:id',(req,res)=>{
    res.render('Mensajes', {
        jquery: '/jquery/jquery.min.js'
      });
})

app.get('/chats', async (req, res) => {
  try {
    console.log(req.session.user)
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