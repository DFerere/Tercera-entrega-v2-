import express from 'express';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import session from 'express-session'; 
import handlebars from 'express-handlebars';
import __dirname from './utils.js';
import { Server } from 'socket.io';

import productsRouterMongo from './routes/productsRouterMongo.js';
import cartsRouterMongo from './routes/cartsRouterMongo.js';
import chatRouterMongo from './routes/chatRouterMongo.js';
import sessionRouter from './routes/sessionsRouter.js'; 
import userRouter from './routes/userRouter.js';
import adminManagement from './routes/realproductsRouterHandlebars2.js';


import ProductManagerMongo from './controllers/mongo/productsManagerMongo.js';
import CartManagerMongo from './controllers/mongo/cartsManagerMongo.js';
import userManager from './controllers/userManager.js';

import { chatModel } from './dao/models/chatmodels.js';
import { productsModel } from './dao/models/productsmodels.js';

import initializePassport from './config/passport.config.js';
import passport from 'passport';

import { Command } from 'commander';
import dotenv from 'dotenv';
import config from './config/config.js';  

const program = new Command(); 

const productosMongo = new ProductManagerMongo();
const carritoMongo = new CartManagerMongo();
const usermongo = new userManager(); 

console.log(config.port); 

const port = parseInt(config.port); 

console.log(port); 


const app = express();


//const httpServer = app.listen(8080, () => console.log("Servidor corriendo!!"));
const httpServer = app.listen(port, () => console.log("Servidor corriendo!!"));

const socketServer = new Server(httpServer);

app.engine('handlebars', handlebars.engine());
 

//Para uso y almacenamiento de sessions
/*app.use(
  session({
    store: MongoStore.create({
      mongoUrl: 
      'mongodb+srv://davidferere:Pagaille.17@ecommerce.zxhcx9m.mongodb.net/?retryWrites=true&w=majority',
      ttl: 15, 
    }), 
    secret: 'davidferere',
    resave: false,
    saveUninitialized: false,
  })
);*/

app.use(
  session({
    store: MongoStore.create({
      mongoUrl: 
      process.env.MONGO_URL_SESSION,
      ttl: 15, 
    }), 
    secret: process.env.MONGO_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

//uso de passport
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(__dirname + '/public'));

/*const DBconnection = async () => {

  await mongoose.connect('mongodb+srv://davidferere:Pagaille.17@ecommerce.zxhcx9m.mongodb.net/?retryWrites=true&w=majority');

}*/

const DBconnection = async () => {

  await mongoose.connect(process.env.MONGO_URL);

}

DBconnection();

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

app.use('/mongo/products', productsRouterMongo); //endpoint para gestionar productos
app.use('/mongo/carts', cartsRouterMongo);
app.use('/api/products/management', productsRouterMongo); //vista de productos del administrador
app.use('/ecommerce/home', sessionRouter); //Ruta de sesiones y login
app.use('/ecommerce/user', userRouter); //Ruta de usarios


//app.use('/products', productsRouterMongo); //view de products

app.use('/api', cartsRouterMongo);

app.use('/api/sessions', sessionRouter);

app.use('/api/chat', chatRouterMongo); //endpoint del chat






//Sockets///

socketServer.on('connection', async socket => {
  console.log("Cliente nuevo conectado")
  const allproducts = await productosMongo.getallProducts();
  //console.log(response);
  socketServer.emit('prod', allproducts);
  socket.on('message', data => {
    console.log(data);
  })

  //Enviar catalogo de productos por handlebars
  const query = {};
  //const allPageProducts = await productosMongo.getpageProducts(query, 1, 10, 1);
  //Traemos productos paginados
  const allPageProducts = await productosMongo.getallProducts();
  //console.log("AllPageProducts"); 
  //console.log(allPageProducts); 
  socketServer.emit('product', allPageProducts);

  //Traemos lista de productos de carritos con populate
  //const cid = cartsRouterMongo.returncid; 
  const cid = "650f8a995f9deb7531fb7380"; 
  const getCart = await carritoMongo.getCartProducts(cid);
  //JSON.stringify(getCart), 
  console.log(getCart);
  console.log(typeof(getCart)); 
  socketServer.emit('cart', getCart);

  ///endpoint chat///////

  socket.on('mensaje', async (data) => {

    await chatModel.create(data);
    const mensajes = await chatModel.find().lean();
    console.log(mensajes);
    socketServer.emit('nuevo_mensaje', mensajes);

  })


  socket.on('sendNewProduct', async id => {
    console.log(id);
    await productsModel.deleteOne(id);
    //const allproducts = await productos.getProducts(); 
    //console.log(response);
    socketServer.emit('prod',);

  })

  socket.on('sendNewProduct2', async add => {
    console.log(add);
    console.log(typeof (add));
    const title = add.title;
    const description = add.description;
    const price = add.price;
    const thumbnail = add.thumbnail;
    const code = add.code;
    const stock = add.stock;
    const status = add.status;
    const category = add.category;

    const response = await productosMongo.createproduct(title, description, price, thumbnail, code, stock, status, category);
    const allproducts = await productsModel.find().lean();
    console.log(allproducts);
    socketServer.emit('prod', allproducts);

  })

  socket.on('addproductCarrito', async idprod => {

    console.log("Ya ingreso en el servidor"); 

    console.log(idprod);
    const cartid = !idprod.idcart ? null : idprod.idcart;
    const idproduct = !idprod.idproduct ? null : idprod.idproduct;
    
  
    console.log(idprod.cartid);
    //console.log(idproduct); 

    //const quantity = 1; 
    //const response = await productos.deleteproductByID(id);

    if (idprod == null && idcart == null) {
      //const response = await carritoMongo.createcart();
    } else {
      console.log("Vamos agregar un producto al carrito");
      console.log(cartid); 
      //const user = await usermongo.finduseremail(emailuser); 
      //console.log(user); 
      //const response2 = await carritoMongo.addProductCart(idcarrito, idproduct);
      //console.log(response);
    }

    //const allproducts = await productosMongo.getallProducts();
    socketServer.emit('prod', allproducts);
    //socketServer.emit('prod', );

  })

  socket.emit('dataserver', "Hola soy el servidor")

});
