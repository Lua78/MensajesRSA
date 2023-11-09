
$("#Principal").on("blur", "input" , function(){
    const valu = $(this).val();
    if(valu.trim() === ''){
        $(this).addClass('has-Error')
    }else{
        $(this).removeClass('has-Error')
    }
})