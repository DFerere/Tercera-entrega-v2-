const socket = io();

socket.emit('message', "Hola, soy el cliente de la vista de carritos"); 
socket.on('dataserver', data => {
    console.log(data);
})

socket.on('cart', data => {

    console.log(data);
   
    actualizarCatalogo(data);
})


function actualizarCatalogo(data) {
    let contenidocambiante = ""
    //const con = data; 
    let catalogo = document.getElementById("carrito");
   
    data.docs.forEach(({ title, description, price, thumbnail, code, stock, category, _id }) => {
        contenidocambiante += `  <div>
       <h1>Lista de productos:</h1>
         <div>
           <h2>${title}</h2>
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


    catalogo.innerHTML = contenidocambiante;

    console.log(contenidocambiante); 

};






/*const idboton = `botonagregar-${data._id}`;
let botonagregar = document.getElementById(idboton);
console.log(botonagregar);

botonagregar.addEventListener('click', (event) => {
    event.preventDefault()
    console.log(event);

    console.log("entre en el evento submit de carrito");
    //const idproduct = `botonagregar-${_id}`;
    let idcarrito = "650f8a995f9deb7531fb7380";
    //const quantity = 1;
    //let idaux = document.getElementById(idproducto);
    socket.emit('addproductCarritodos', {
        idcarrito,
        idproduct,
    })
    botonagregar.reset()

})*/

//})

/*const idboton = `botonagregar-${data._id}`;
let botonagregar = document.getElementById("idboton");

botonagregar.addEventListener('click', (event) => {
    event.preventDefault()
    console.log(event);

    console.log("entre en el evento submit de carrito");
    //const idproduct = `botonagregar-${_id}`;
    let idcarrito = "650f8a995f9deb7531fb7380";
    //const quantity = 1;
    //let idaux = document.getElementById(idproducto);
    socket.emit('addproductCarritodos', {
        idcarrito,
        idproduct,
    })
    botonagregar.reset()

})*/