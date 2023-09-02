// RELACIONADO A LA UBICACIÓN Y PRODUCCIÓN DE LAS TARJETAS EN EL INICIO CON EL JSON

const contenedorTarjetas = document.querySelector("#discos");

// LLAMO AL JSON CON LOS DATOS DE LA DISCOGRAFIA

function crearTarjetasProductosInicio () {
    fetch("json/discos.json") 
    .then((response) => {
        return response.json()
        })  
    .then((datos) => {
        renderArray(datos) 
    })
    .catch((error) => {
        console.log("error", error);
    });
};

// RECORRO TODO EL JSON DE DISCOS Y LO TRAIGO AL INDEX EN FORMATO DE TARJETAS
function renderArray(discografia) { 
    discografia.forEach((disco) => { 
        const tarjetasDeDiscos = document.createElement ("div")
        tarjetasDeDiscos.classList.add ("disco-tarjeta")
        tarjetasDeDiscos.innerHTML =`
                <img src= ./img/Discografia/${disco.id}.jpg alt="${disco.titulo}">
                <h4>${disco.titulo}</h4>
                <p>$${disco.precio}</p>     
                <button class = "comprar-disco" id = ${disco.id}>Agregar al carrito</button>               
            `
        contenedorTarjetas.appendChild (tarjetasDeDiscos)
    });
}

crearTarjetasProductosInicio()

// RELACIONADO A LA FUNCIONABILIDAD DEL CARRITO EL LOCAL STORAGE

let carritoDeComprasLista = []; 

const discosElegidos = document.querySelector ("#discos-elegidos tbody"); 

// FUNCION QUE REACCIONA AL CLICK EN AGREGAR DISCO

contenedorTarjetas.addEventListener("click", comprarDisco)

function comprarDisco(evt){
    evt.preventDefault(); 
    if(evt.target.classList.contains("comprar-disco")){ 
        const album = evt.target.parentElement; 
        albumElegido (album); 
    }
    actualizarNumeroCarrito ()
    calcularTotal ()
    informacionCarrito ()
}

// DATOS QUE AGREGO AL CARRITO, COMO LOS IMPRIMO Y FILTRO 

function albumElegido (cd) {
    const datosDelAlbum = { 
        album: cd.querySelector ("img").src,
        titulo: cd.querySelector ("h4").textContent,
        precio: cd.querySelector ("p").textContent,
        id: cd.querySelector ("button").getAttribute("id"), 
        cantidad: 1
    }

    // FILTRO DE DATOS QUE HAY EN EL CARRITO PARA SUMAR Y EN CASO DE NO HABER, AGREGAR NUEVO DATO

    if(carritoDeComprasLista.some(cd => cd.id === datosDelAlbum.id )){ 
        const nuevoCarrito = carritoDeComprasLista.map((cd) => { 
            if (cd.id === datosDelAlbum.id){
                cd.cantidad++;
                return cd
            } else {
                return cd
            }     
        })
        carritoDeComprasLista = nuevoCarrito.slice(); 
    } else{
        carritoDeComprasLista.push(datosDelAlbum)
    };

    presentacionCarrito () 
}

// PRESENTACIÓN DE DATOS EN EL CARRITO

function presentacionCarrito () {
    borrarCarrito() 

    carritoDeComprasLista.forEach(disco => {
        const seleccionDiscos = document.createElement ("tr")
        seleccionDiscos.innerHTML =`
        <td><img src= ./img/Discografia/${disco.id}.jpg alt="${disco.titulo}"></td>
        <td>${disco.titulo}</td>
        <td>${disco.precio}</td>
        <td>${disco.cantidad}</td>
        `
        discosElegidos.appendChild (seleccionDiscos)        
    });

    sincronizarStorage() 
};

// SINCRONIZACIÓN DE DATOS EN EL STORAGE
function sincronizarStorage() {
    localStorage.setItem("carrito", JSON.stringify(carritoDeComprasLista)) 
}

//BORRO LISTA PREDEFINIDA DEL CARRITO, EVITANDO GENERAR NUEVAS ESTRUCTURAS REPETIDAS DE DATOS
function borrarCarrito() {
    while(discosElegidos.firstChild){
        discosElegidos.removeChild(discosElegidos.firstChild)
    }
}

// INFORMO QUE ACCIONES SE DEBEN REALIZAR POSTERIOR A LA CARGA DEL DOM, TENIENDO EN CUENTA SI EL CARRITO TIENE O NO DATOS
document.addEventListener("DOMContentLoaded", ()=> {
    if(JSON.parse (localStorage.getItem("carrito"))){ 
        carritoDeComprasLista = JSON.parse (localStorage.getItem("carrito"));
    } else {
        carritoDeComprasLista =[] 
    }
    informacionCarrito ()
    presentacionCarrito() 
    calcularTotal () 
})

// FUNCIONABILIDAD DE VACIAR EL CARRITO CON EL BOTON DEL MISMO
const borrarDiscos = document.querySelector ("#borrar-discos");
borrarDiscos.addEventListener ("click", borrarDiscosBtn)

function borrarDiscosBtn (evt) {
    evt.preventDefault();
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
            localStorage.removeItem("carrito"); 
            carritoDeComprasLista = [];
            sincronizarStorage();
            actualizarNumeroCarrito ();
            informacionCarrito ();
        }})
}

// ACTUALIZAR NÚMERO DE CARRITO
const cantidadCarrito = document.querySelector("#cantidad-carrito")

function actualizarNumeroCarrito () {
    const memoria = JSON.parse (localStorage.getItem("carrito")); 
    const total = memoria.reduce((acumulador, discos) => acumulador + discos.cantidad,0) 
    cantidadCarrito.innerText = total 
}
actualizarNumeroCarrito () 

// CALCULAR TOTAL DEL CARRITO
const resultado = document.querySelector ("#resultado")

function calcularTotal () {
    const memoria = JSON.parse (localStorage.getItem("carrito"))
    const precioFinal = memoria.reduce ((total, album) => {
        const albumEnDiscosElegidos = carritoDeComprasLista.find(cd => cd.album === album.album);
        if (albumEnDiscosElegidos) {
            const precioTotal = parseFloat(albumEnDiscosElegidos.precio.replace("$", ""));
            return total + precioTotal * albumEnDiscosElegidos.cantidad;
        } else {
            return total;
        }
    }, 0);
    resultado.innerText = precioFinal;
}

// INFORMAR SI HAY PRODUCTOS DENTRO DEL CARRITO Y SINO, INDICAR CARRITO VACIO
const carritoConProductos = document.querySelector ("#carrito-con-productos");
const carritoVacio = document.querySelector ("#carrito-vacio");

function informacionCarrito () {
    if (carritoDeComprasLista.length > 0) {
        carritoConProductos.classList.remove ("no-figurar");
        carritoVacio.classList.add ("no-figurar");
    } else {
        carritoConProductos.classList.add ("no-figurar");
        carritoVacio.classList.remove ("no-figurar");
    }
}

//SACO FUNCIÓN AL LINK DE LA IMAGEN DEL CARRITO
const imagenCarrito = document.querySelector ("#imagen-carrito")
imagenCarrito.addEventListener ("click", quitarFuncion)
function quitarFuncion (evt){
    evt.preventDefault();
}