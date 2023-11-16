const Encriptaciones = require('../src/utils/GeneradorClaves.js');
const SqlConexion = require('../src/conexion/SQLConexion')
const express = require('express');
const app = express();


app.get('/', (req, res) => {
  res.redirect('/Login');
});
app.get('/Registro', (req,res)=>{
  res.render('Sesion/Registro')
} )
app.post('/Registro', async (req, res) => {
  try {
    const { nombre, username, contrasena } = req.body;
    console.log(nombre, username, contrasena)
    const existe = await SqlConexion.ExisteUsuario(username);
    console.log(existe)
    if(existe===true){
      res.status(401).send('Nombre de usuario no disponible.');
      console.log('retonando')
      return
    }else{
      console.log('adasjhdajsdhsadh')
      let contrasenaEn = await Encriptaciones.hashContraseña(contrasena);
      const resultado = await Encriptaciones.GenerarClaves();
      const userPublicKey = resultado.publicKey;
      const userPrivateKey = resultado.encryptedPrivateKey;
      await SqlConexion.insertarUsuario(nombre, username, contrasenaEn, userPrivateKey, userPublicKey, false);
      console.log('Usuario registrado correctamente.');
      const userP = await SqlConexion.getUsuario(username)
      req.session.user =  userP
      //req.sessionID = userP.id
      res.status(200).send('Exitoso');
    }
  } catch (error) {
    console.error('Error en la petición /Registro:', error);
    res.status(500).send('Error del servidor');
  }
});

app.get('/Login',(req,res)=>{
  res.render('Sesion/Login');
})

app.post('/Login', async (req, res) => {
  try {
    const {username,contrasena} = req.body
    console.log(username,  " --- ",contrasena)
    const existe = await SqlConexion.ExisteUsuario(username);
    if(existe){
      const userP = await SqlConexion.getUsuario(username);
      if(await Encriptaciones.compararContrasena(contrasena,userP.contrasena)){
        req.session.user = userP;
        res.redirect('/chats')
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

app.post('/logout',(req,res)=>{
  req.session.destroy
  req.session.user = null;
  res.status(200).send('Hasta Luego');
})
module.exports = app