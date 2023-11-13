
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
    AlertaExitoso(response);
  });
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
