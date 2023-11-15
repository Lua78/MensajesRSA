var mensajesContainer = $("#chat-container");

$('li').on('click', function() {
    id =  $(this).val();
    $('li').removeClass('lclick');
    $(this).addClass('lclick');
    $('#userdes').html($(this).text());
    $('#userdes').val(id);
    CargarMensajes(id);
});

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
      AlertaExitoso(response);
    });
  
    $('#message-input').val('');
});

function CargarMensajes(id_receptor){
  $.post("/cargar-mensajes", { receptor_id: id_receptor}, function (response) {
    mensajesContainer.empty();
    response.Mensajes.forEach(function (mensaje) { 
      var claseMensaje = mensaje.remitente_id === response.idUsuario ? 'remitente' : 'destinatario';
      var mensajeHtml = "<div class='" + claseMensaje + "'>" + mensaje.mensaje + "</div>";
      mensajesContainer.append(mensajeHtml);
    });
  });
}
function CargarMensajes(id_receptor){
  $.post("/cargar-mensajes", { receptor_id: id_receptor}, function (response) {
    mensajesContainer.empty();
    response.Mensajes.forEach(function (mensaje) { 
      var claseMensaje = mensaje.remitente_id === response.idUsuario ? 'remitente' : 'destinatario';
      var mensajeHtml = "<div class='" + claseMensaje + "'>" + 
                         "<span class='mensaje-texto-"+claseMensaje +"'>" + mensaje.mensaje + "</span>" +
                         "<span class='mensaje-hora-"+claseMensaje +"'>" + obtenerHoraMensaje(mensaje.fecha_envio) + "</span> " +
                         "</div>";
      mensajesContainer.append(mensajeHtml);
      mensajesContainer.append($('<br>'));
    });
    mensajesContainer.scrollTop(mensajesContainer.prop("scrollHeight"));
  });
}

function obtenerHoraMensaje(fechaEnvio) {
  var fecha = new Date(fechaEnvio);
  var hora = fecha.getHours();
  var minutos = fecha.getMinutes();
  return hora + ":" + (minutos < 10 ? '0' : '') + minutos;
}

function cerrarSesion(){
  $.post("/logout",
    function (data, textStatus, jqXHR) {
      AlertaExitoso(data);
      setTimeout(function(){
        window.location.href = '/';
      },1000) 
    },
  );
}

function toggleDiv1() {
  $("#toggleButton1").hide();
  setTimeout(100);
  $("#contacts-container").toggle("collapsed");
}
function toggleDiv2() {
  $("#contacts-container").toggle("collapsed");
  setTimeout(100);
  $("#toggleButton1").show();
}
