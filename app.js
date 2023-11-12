const express = require('express');
const app = express();
const port = 3000; 
const morgan = require('morgan');
const path = require('path');
const messagesR = require("./routes/messages.route")
const usersR = require("./routes/users.route")
const session = require('express-session');

app.use(session({
  secret: 'akjshdaslkd35asdf45ads4a-aas36as5d65',
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 60 * 60 * 1000 * 12,
    secure: false,     // Configúralo a 'true' si estás usando HTTPS
  }
}));

app.use(morgan('combined')); 

app.set('view engine', 'ejs');
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

app.listen(port, () => {
  console.log(`Servidor en ejecución en http://localhost:${port}`);
});
