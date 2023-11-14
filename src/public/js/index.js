const socket = io();
socket.emit('message', "Hola, soy el cliente")
socket.on('dataserver', data => {
    console.log(data);
})

///////////Comienzo chat////////////////////
/*
let usuario = '';
Swal.fire({
  title: 'Ingresa un correo',
  input: 'text',
  confirmButtonText: 'Ingresar',
}).then((result) => {
  usuario = result.value;
});

const caja = document.getElementById('caja');
const contenido = document.getElementById('contenido');

caja.addEventListener('change', (e) => {
  socket.emit('mensaje', {
    correo: usuario,
    mensaje: e.target.value,
  });
});

socket.on('nuevo_mensaje', (data) => {
  const mensajes = data.map(({ correo, mensaje }) => {
    return `<p>${correo} dijo: ${mensaje}</p>`;
  });
  contenido.innerHTML = mensajes.join('');
});
*/
////////////Fin Chat///////////////////////////////////


let formdata = document.getElementById("formulario");
console.log(formdata);

formdata.addEventListener('submit', (event) => {
   event.preventDefault()
  console.log(event);

  console.log("entre en el evento submit");
  let id = formdata.elements.idproducto.value;
    //let idaux = document.getElementById(idproducto);
  socket.emit('sendNewProduct', {
      id,
    })
  formdata.reset()

})

let formdata2 = document.getElementById("formadd");
console.log("imprimo formdata2");
console.log(formdata2);



formdata2.addEventListener('submit', (event) => {
    event.preventDefault()
    console.log(event);
    console.log("entre en el evento submit de agregar producto");
    let title = formdata2.elements.title.value;
    console.log(title); 
    let description = formdata2.elements.description.value;
    let price = formdata2.elements.price.value;
    let thumbnail = formdata2.elements.thumbnail.value;
    let code = formdata2.elements.code.value;
    let stock = formdata2.elements.stock.value;
    let status = formdata2.elements.status.value;
    let category = formdata2.elements.category.value;


    //let idaux = document.getElementById(idproducto);
    socket.emit('sendNewProduct2', {
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        status,
        category,


    })
    formdata2.reset()
})


let carrito = document.getElementById("carrito");
console.log(carrito);

carrito.addEventListener('submit', (event) => {
  event.preventDefault()
  console.log(event);

  console.log("entre en el evento submit de carrito");
  let idproduct = carrito.elements.idproducto.value;
  let idcarrito = carrito.elements.idcarrito.value;
  const quantity = 1;
    //let idaux = document.getElementById(idproducto);
  socket.emit('addproductCarrito', {
      idcarrito,
      idproduct,
    })
  carrito.reset()

})

let articulo = document.getElementById("articulo");

socket.on('prod', data => {
  let contenidocambiante = ""

    data.forEach(({title, description, price, thumbnail, code, stock, category, id}) => {
      contenidocambiante += `  <div>
       <h1>Lista de productos:</h1>
         <div>
           <h2>$${title}</h2>
           <h3>Descripcion:</h3>
           <p>${description}</p>
           <h3>Precio:</h3>
           <p>${price}</p>
           <h3>Url:</h3> 
           <p>${thumbnail}</p>
           <h3>Codigo:</h3>
           <p>${code}</p>
           <h3>En stock:</h3>
           <p>${stock}</p> 
           <h3>Categoria:</h3>
           <p>${category}$</p>
           </div>
      </div>`
     

    });

    articulo.innerHTML = contenidocambiante

})

//Productos para la vista de productos catalogo

/*let catalogo = document.getElementById("catalogo");

socket.on('product', data => {
  let contenidocambiante = ""

    data.forEach(({title, description, price, thumbnail, code, stock, category, id}) => {
      contenidocambiante += `  <div>
       <h1>Lista de productos:</h1>
         <div>
           <h2>$${title}</h2>
           <h3>Descripcion:</h3>
           <p>${description}</p>
           <h3>Precio:</h3>
           <p>${price}</p>
           <h3>Url:</h3> 
           <p>${thumbnail}</p>
           <h3>Codigo:</h3>
           <p>${code}</p>
           <h3>En stock:</h3>
           <p>${stock}</p> 
           <h3>Categoria:</h3>
           <p>${category}$</p>
           </div>
      </div>`
     

    });

    catalogo.innerHTML = contenidocambiante

})*/





//document.getElementById("boton").addEventListener("click", function () {
  //  const producttoDelete = document.getElementById("idproducto");
    //const PRODID = parseInt(producttoD)
    //const PRODID = parseInt(producttoDelete.value, 10);
    //socket.emit("functionDeleteProduct", PRODID);
    //producttoDelete.value = "";
//});