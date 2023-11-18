
const socket = io();
var idChat =  0
var mensajesContainer = $("#chat-container");
var userId = null;
$("li").on("click", function () {
  idChat = $(this).val();
  $("li").removeClass("lclick");
  $(this).addClass("lclick");
  $("#userdes").html($(this).text());
  $("#userdes").val(idChat);
  DesconectarDeSalaAnterior();
  ConectarSalaReceptor(idChat);
  $("#contacts-container").toggle("collapsed");
  setTimeout(100);
  $("#toggleButton1").show();
  CargarMensajes(idChat);
});

function DesconectarDeSalaAnterior() {
  const salaAnterior = $("#userdes").val();
  if (salaAnterior) {
    socket.emit("leave", { sala: salaAnterior });
  }
}

function ConectarSalaReceptor(id) {
  socket.emit("join", { sala: id });
}
function obtenerHoraMensaje(tiempoTranscurrido) {
  const fecha = new Date(tiempoTranscurrido);
  var hora = fecha.getHours();
  var minutos = fecha.getMinutes();
  const horaA =  hora + ":" + (minutos < 10 ? "0" : "") + minutos;
  return horaA
}

// Obtener ID de usuario y unirse a su sala
fetch("/obtener-id-usuario", {
  method: "GET",
  credentials: "include",
})
  .then((response) => response.json())
  .then((data) => {
    userId = data.id;
    socket.emit("join", { sala: userId });
    socket.on("nuevo-mensaje", (mensaje) => {
      if(mensaje.sala == userId && idChat!=0 && mensaje.remitente === idChat ){
        $.post("/get-decrypt", { msj:mensaje.mensaje }, function (response) {
          console.log(response.mensajedes);
          const horaActual = obtenerHoraMensaje(mensaje.tiempo);
          var claseMensaje = 'destinatario';
          var mensajeHtml =
            "<div class='" +
            claseMensaje +
            "'>" +
            "<span class='mensaje-texto-" +
            claseMensaje +
            "'>" +
            response.msj +
            "</span>" +
            "<span class='mensaje-hora-" +
            claseMensaje +
            "'>" +
            horaActual +
            "</span> " +
            "</div>";
          mensajesContainer.append(mensajeHtml);
          mensajesContainer.scrollTop(mensajesContainer.prop("scrollHeight"));
        });

      }

    });
  })
  .catch((error) =>
    console.error("Error al obtener el ID del usuario:", error)
  );
