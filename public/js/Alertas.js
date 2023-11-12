
function AlertaErr(mensaje) {
  Swal.fire({
    title: "Error!",
    text: mensaje,
    icon: "error",
    confirmButtonText: "Cool",
  });
}

function AlertaExitoso(mensaje){
  Swal.fire({
    position: "top-end",
    icon: "success",
    title: mensaje,
    showConfirmButton: false,
    timer: 1500
  });
}