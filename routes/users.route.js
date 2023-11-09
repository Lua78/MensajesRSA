const GenerarClaves = require('../src/utils/GeneradorClaves');

const app = require('express')();


app.get('/Registro',(req,res)=>{
    res.render('Sesion/Registro');
})

app.get('/Login',(req,res)=>{
  res.render('Sesion/Login');
})
app.post('/Login',(req,res)=>{
  GenerarClaves();
  res.redirect('/Registro');
})

module.exports = app