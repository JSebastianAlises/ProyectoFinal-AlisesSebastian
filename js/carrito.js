const discosEnCarrito = JSON.parse (localStorage.getItem("carrito"))

const contenedorTarjetasDeCarrito = document.querySelector ("#carrito-de-compras table tbody");
const contenedorCarritoVacio = document.querySelector ("#contenedor-carrito-vacio");
const contenedorCarritoDeCompras = document.querySelector ("#carrito-de-compras");
const contenedorAccionesDeCarrito = document.querySelector ("#acciones-de-carrito");
const comprar = document.querySelector ("#Comprar");
const compraRealizada = document.querySelector ("#compra-realizada"); 
const tituloCarritoDeCompras = document.querySelector ("#titulo-carrito-de-compras") 

// CREACIÓN DE TARJETAS EN EL CARRITO DE COMPRAS CON DATOS DEL STORAGE
function crearTarjetasDeCarrito () {

    contenedorTarjetasDeCarrito.innerHTML = "";
    //INFORMACIÓN QUE SALE EN CASO DE HABER O NO DATOS Y QUE MOSTRAR
    if (discosEnCarrito.length > 0) { 

        contenedorCarritoVacio.classList.add("no-figurar");
        contenedorCarritoDeCompras.classList.remove("no-figurar");
        contenedorAccionesDeCarrito.classList.remove("no-figurar");
        compraRealizada.classList.add("no-figurar")

        discosEnCarrito.forEach(disco => {
        const seleccionDiscos = document.createElement ("tr");
        seleccionDiscos.classList.add("disco-carrito");
        seleccionDiscos.innerHTML =`
            <td><img src= ../img/Discografia/${disco.id}.jpg alt="${disco.titulo}"></td>
            <td>${disco.titulo}</td>
            <td><button id="${disco.id}" class="eliminar-cd">-</button>  <span class="cantidad">${disco.cantidad}</span>  <button id="${disco.id}" class="sumar-cd">+</button></td>  
            <td>${disco.precio}</td>
            <td>$${parseFloat(disco.precio.replace("$", "")) * parseInt(disco.cantidad)}</td>             
        `
        contenedorTarjetasDeCarrito.appendChild (seleccionDiscos)   
    })}
    else {
        contenedorCarritoVacio.classList.remove("no-figurar");
        contenedorCarritoDeCompras.classList.add("no-figurar");
        contenedorAccionesDeCarrito.classList.add("no-figurar");
        compraRealizada.classList.add("no-figurar");
    }
    actualizarBotones()
}

crearTarjetasDeCarrito ()

// BOTON + PARA SUMAR CD
function sumarDisco (disco) {
    const cd = disco.currentTarget.id 
    const restarCd = discosEnCarrito.find (disco => disco.id === cd) 

    if (restarCd.cantidad >= 1) {
        restarCd.cantidad++; 
    }     
    crearTarjetasDeCarrito ()
    sincronizarStorage()
    calcularTotal ()
    calcularTotalDiscos ()
}


// BOTON - PARA RESTAR CD
function eliminarDisco (disco) {
    const cd = disco.currentTarget.id;
    const indexCd = discosEnCarrito.findIndex (disco => disco.id === cd);
    let finalCd = 0;
    discosEnCarrito[indexCd].cantidad --;
    finalCd = discosEnCarrito[indexCd].cantidad;
    if (finalCd === 0 ) {
        discosEnCarrito.splice(indexCd,1)
    }

    crearTarjetasDeCarrito ()
    sincronizarStorage()
    calcularTotal ()
    calcularTotalDiscos ()
}

// ACTUALIZACIÓN DE BOTONES PARA PODER USARLOS DE MANERA CONTINÚA
function actualizarBotones() { 
    const eliminarCd = document.querySelectorAll(".eliminar-cd");
    const sumarCd = document.querySelectorAll (".sumar-cd");

    sumarCd.forEach(cd => { 
        cd.addEventListener("click", sumarDisco);
    });
    eliminarCd.forEach(cd => { 
        cd.addEventListener("click", eliminarDisco);
    });
}

// FUNCIONABILIDAD PARA EL BOTON REINICIAR Y ASÍ VACIAR EL CARRITO 
const btnVaciarCarrito = document.querySelector ("#vaciar-carrito");

btnVaciarCarrito.addEventListener ("click", vaciarCarrito);

function vaciarCarrito () {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "Eliminarás todos los discos seleccionados",
        icon: 'warning',
        showCancelButton: true,
        background: "#808080",
        color:"#fff",
        confirmButtonColor: '#d45522',
        cancelButtonColor: '#d45522',
        confirmButtonText: 'Si',
        cancelButtonText: 'No',
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            background: "#808080",
            color:"#fff",
            title: 'Discos eliminados',
            text:'Si lo deseas, podras volver a la tienda a elegir de nuevo',
            icon: 'success',
            confirmButtonText: 'De acuerdo',
            confirmButtonColor: '#d45522',
          })
          discosEnCarrito.length = 0;
          sincronizarStorage()
          crearTarjetasDeCarrito ()
        }
      })
}

// CALCULAR EL MONTO TOTAL
const resultado = document.querySelector ("#resultado")

function calcularTotal () {

    const precioFinal = discosEnCarrito.reduce ((total, album) => {
        const albumEnDiscosElegidos = discosEnCarrito.find(cd => cd.album === album.album);
        if (albumEnDiscosElegidos) {
            const precioTotal = parseFloat(albumEnDiscosElegidos.precio.replace("$", ""));
            return total + precioTotal * albumEnDiscosElegidos.cantidad;
        } else {
            return total;
        }
    }, 0);
    resultado.innerText = precioFinal;
}
calcularTotal ()

// INFORMACIÓN DE LA CANTIDAD TOTAL
const totalDiscos = document.querySelector ("#total-discos")

function calcularTotalDiscos () {

    const discosTotal = discosEnCarrito.reduce ((total, album) => {
        const albumEnDiscosElegidos = discosEnCarrito.find(cd => cd.album === album.album);
        if (albumEnDiscosElegidos) {
            const discosTotal = parseFloat(albumEnDiscosElegidos.cantidad);
            return total + discosTotal
        } else {
            return total;
        }
    }, 0);
    totalDiscos.innerText = discosTotal;
}
calcularTotalDiscos ()

// FUNCIONABILIDAD DEL BOTON COMPRAR
comprar.addEventListener ("click", comprarCarrito)

function comprarCarrito () {
    Swal.fire({
        title: '¿Deseas finalizar la compra?',
        showCancelButton: true,
        background: "#808080",
        color:"#fff",
        confirmButtonColor: '#d45522',
        cancelButtonColor: '#d45522',
        confirmButtonText: 'Si, de acuerdo',
        cancelButtonText: 'No',
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            background: "#808080",
            color:"#fff",
            title: 'Te agradece tu compra',
            text:'LOS MISMOS DE SIEMPRE',
            icon: 'success',
            confirmButtonColor: '#d45522',
          })
          discosEnCarrito.length = 0;
          sincronizarStorage() 
          
          contenedorCarritoVacio.classList.add("no-figurar");
          contenedorCarritoDeCompras.classList.add("no-figurar");
          contenedorAccionesDeCarrito.classList.add("no-figurar");
          tituloCarritoDeCompras.classList.add("no-figurar");
          compraRealizada.classList.remove("no-figurar");
        }
      })
}

// SINCRONIZACIÓN DE DATOS EN EL STORAGE
function sincronizarStorage() {
    localStorage.setItem("carrito", JSON.stringify(discosEnCarrito)) 
}