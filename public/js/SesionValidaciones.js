
$("#Principal").on("blur", "input" , function(){
    const valu = $(this).val();
    if(valu.trim() === ''){
        $(this).addClass('has-Error')
    }else{
        $(this).removeClass('has-Error')
    }
})

$("#PrincipalRegistro").on("blur", "input" , function(){
    const valu = $(this).val();
    if(valu.trim() === ''){
        $(this).addClass('has-Error')
    }else{
        $(this).removeClass('has-Error')
    }
})
$("#PrincipalRegistro").on('submit',function(e){
    e.preventDefault();
    var contrasena = $("#contrasena").val();
    var contrasenaR = $("#contrasenaR").val();
    if(contrasena !== contrasenaR){
        AlertaErr("Las contraseñas no coinciden");
        $("#contrasena").val('');
        $("#contrasenaR").val('');
    }else{
        const nombre = $('#nombre').val();
        const contrasena = $('#contrasena').val();
        const username = $('#username').val();
        $.ajax({
            url: '/Registro',
            type: 'POST',
            data: { nombre, username, contrasena },
            success: function (response) {
              window.location = '/chats';
            },
            error: function (xhr, status, error) {
                AlertaErr('Usuario no disponible');
            }
        });
    }
});