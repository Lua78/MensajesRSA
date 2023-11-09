const app = require('express')();


app.get('/Registro',(req,res)=>{
    res.render('Sesion/Registro');
})

app.get('/Login',(req,res)=>{
  res.render('Sesion/Login');
})

module.exports = app