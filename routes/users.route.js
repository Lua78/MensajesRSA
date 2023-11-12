const Encriptaciones = require('../src/utils/GeneradorClaves.js');
const SqlConexion = require('../src/conexion/SQLConexion')
const bodyParser = require('body-parser');
const app = require('express')();
const session = require('express-session');


app.use(session({
  secret: 'akjshdaslkd35asdf45ads4a-aas36as5d65', // Clave secreta para firmar la cookie de sesión
  resave: true,
  saveUninitialized: true,
}));

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
    const {username,contrasena} = req.body
    const existe = await SqlConexion.ExisteUsuario(username);
    if(existe){
      console.log("adasjkd");
      const user = await SqlConexion.getUsuario(username);
      const pass = await Encriptaciones.AesDecryptPass(user.contrasena)
      if(pass === contrasena){
        req.session.user = username;
        res.redirect('/chats');
      }else{
        res.render('Sesion/Login',{
          mensaje : 'Usuario o contraseña incorrectos'
        })
      }
    }else{
      res.render('Sesion/Login',{
        mensaje : 'Usuario o contraseña incorrectos'
      });
    }
  } catch (error) {
    console.error('Error en la ruta /Login:', error);
    res.render('Sesion/Login');
  }
});


module.exports = app