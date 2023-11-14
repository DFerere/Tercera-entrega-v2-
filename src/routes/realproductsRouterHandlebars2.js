import { Router } from 'express';

import ProductManager from '../controllers/ProductManager.js';
import serviceproducts from '../repository/servicesproducts.js';


const router = Router(); 

//const productos = new ProductManager();

const productos = new serviceproducts();

router.get('/', async (req, res)  => { //trae lista de productos con param limit

    //const response = await productos.getProducts();

    res.render('productsmanagement'); 
})

router.post('/', async (req, res)  => { //trae lista de productos con param limit

    //const response = await productos.getProducts();

    res.render('productsmanagement', {products:response})
})

router.delete("/", async (req, res) => {
   
    const objectsession  = req.session;
    console.log("este es req session"); 
    console.log(req.session.email);
    
    //req.body.username = username;

    //console.log(username); 

    res.render("realTimeProducts2", { objectsession }); 
})

router.put("/", async (req, res) => {
   
    const objectsession  = req.session;
    console.log("este es req session"); 
    console.log(req.session.email);
    
    //req.body.username = username;

    //console.log(username); 

    res.render("realTimeProducts2", { objectsession }); 
})

export default router; 