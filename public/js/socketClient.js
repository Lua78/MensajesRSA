const socket = io();

$('#send-button').on('click', function () {
  const rec = $('#userdes').val();
  if (rec === '-1') {
    AlertaErr('Debes seleccionar un usuario')
    return;
  }
  const mess = $('#message-input').val()
  if (mess.trim() === '') {
    AlertaErr('Escribe algo...')
    return;
  }
  $.post("/ingresar-mensaje", { receptor_id: rec, mensaje: mess }, function (response) {
    console.log("Exitoso");
  });

  $('#message-input').val('');
});

var mensajesContainer = $("#chat-container");
var userId = null;
// Maneja el clic en los elementos <li>
$('li').on('click', function() {
  const id =  $(this).val();
  $('li').removeClass('lclick');
  $(this).addClass('lclick');
  $('#userdes').html($(this).text());
  $('#userdes').val(id);

  // Desconecta de la sala anterior (si existe)
  DesconectarDeSalaAnterior();

  // Conéctate a la nueva sala
  ConectarSalaReceptor(id);

  // Carga los mensajes de la nueva sala
  CargarMensajes(id);
});

// Desconectar de la sala anterior
function DesconectarDeSalaAnterior() {
  const salaAnterior = $('#userdes').val();
  if (salaAnterior) {
    socket.emit('leave', { sala: salaAnterior });
  }
}

// Conectar a la nueva sala
function ConectarSalaReceptor(id) {
  socket.emit('join', { sala: id });
}
function obtenerHoraMensaje(fechaEnvio) {
  var fecha = new Date(fechaEnvio);
  var hora = fecha.getHours();
  var minutos = fecha.getMinutes();
  return hora + ":" + (minutos < 10 ? '0' : '') + minutos;
}


// Obtener ID de usuario y unirse a su sala
fetch('/obtener-id-usuario', {
  method: 'GET',
  credentials: 'include'
})
  .then(response => response.json())
  .then(data => {
    console.log("data: ", data)
    userId = data.id;
    
    // Unirse a la sala del usuario actual
    socket.emit('join', { sala: userId });
    // Escuchar eventos de nuevos mensaje
  })
.catch(error => console.error('Error al obtener el ID del usuario:', error));
socket.on('nuevo-mensaje', (mensaje) => {
  console.log(mensaje.tipo)
  var claseMensaje = mensaje.tipo === 2 ? 'remitente' : 'destinatario';
  var mensajeHtml = "<div class='" + claseMensaje + "'>" + 
                     "<span class='mensaje-texto-"+claseMensaje +"'>" + mensaje.mensaje + "</span>" +
                     "<span class='mensaje-hora-"+claseMensaje +"'>" + obtenerHoraMensaje(mensaje.fecha_envio) + "</span> " +
                     "</div>";
  mensajesContainer.append(mensajeHtml);
  console.log('Nuevo mensaje recibido:', mensaje);
  // Puedes hacer algo con el mensaje, por ejemplo, mostrarlo en la interfaz
});