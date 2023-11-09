const app = require('express')();


app.get('/Mensaje:id',(req,res)=>{
    res.render('Mensajes', {
        jquery: '/jquery/jquery.min.js'
      });
})

module.exports = app