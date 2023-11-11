
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
    // Validar el formulario aquí
    var contrasena = $("#contrasena").val();
    var contrasenaR = $("#contrasenaR").val();
    if(contrasena !== contrasenaR){
        alert("Las contraseñas no coinciden");
        e.preventDefault(); 
        $("#contrasena").val('');
        $("#contrasenaR").val('');
    }
});