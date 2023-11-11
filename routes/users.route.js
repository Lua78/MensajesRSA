const Encriptaciones = require('../src/utils/GeneradorClaves.js');
const SqlConexion = require('../src/conexion/SQLConexion')
const bodyParser = require('body-parser');
const app = require('express')();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.redirect('/Login');
});
app.get('/Registro', (req,res)=>{
  res.render('Sesion/Registro')
} )

app.post('/Registro', async (req, res) => {
  try {
    const { nombre, username, contrasena } = req.body;
    let contrasenaEn = await Encriptaciones.AesEncryptPass(contrasena);
    const resultado = await Encriptaciones.GenerarClaves();
    const userPublicKey = resultado.publicKey;
    const userPrivateKey = resultado.encryptedPrivateKey;
    await SqlConexion.insertarUsuario(nombre, username, contrasenaEn, userPrivateKey, userPublicKey, false);
    console.log('Usuario registrado correctamente.');
    res.redirect('/chats');
  } catch (error) {
    console.error('Error en la petición /Registro:', error);
    res.redirect('/Registro');
  }
});

app.get('/Login',(req,res)=>{
  res.render('Sesion/Login');
})
app.post('/Login', async (req, res) => {
  try {
    res.redirect('/Registro');
  } catch (error) {
    console.error('Error en la ruta /Login:', error);
    res.redirect('/Login');
  }
});


module.exports = app