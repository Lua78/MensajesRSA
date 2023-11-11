const app = require('express')();
const Encriptaciones = require('../src/utils/GeneradorClaves.js');
const SqlConexion = require('../src/conexion/SQLConexion')

app.get('/Mensaje:id',(req,res)=>{
    res.render('Mensajes', {
        jquery: '/jquery/jquery.min.js'
      });
})
app.get('/chats', async (req, res) => {
  try {
    const result = await SqlConexion.getUsuarios('jose');
    res.render('messages/chat', {
      usuarios: result, 
    });
  } catch (error) {
    console.error('Error al cargar a los usuarios: ', error);
    res.status(500).send('Error interno del servidor');
  }
});

module.exports = app