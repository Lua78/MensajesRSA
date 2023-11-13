
$('li').on('click', function() {
    $('li').removeClass('lclick');
    $(this).addClass('lclick');
    $('#userdes').html($(this).text());
    $('#userdes').val($(this).val());
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
