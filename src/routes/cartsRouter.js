import { Router } from 'express';

import ProductManager from '../controllers/ProductManager.js';
import CartManager from '../controllers/CartManager.js';

const router = Router(); 

//const pm = require("./ProductManager.js");

//app.use(express.urlencoded({ extended: true }));
//app.use(express.json());

const carts = new CartManager(); 

router.post('/', async (req, res)  => {

    //const prod = req.body; 

    //console.log(prod.title); 
    
    await carts.createCart();

    res.status(200).send();
})

router.get('/:cid', async (req, res)  => {

    var cid = parseInt(req.params.cid);
    
    const response = await carts.getcartByID(cid);

    res.send(response)
})

router.post('/:cid/products/:pid', async (req, res)  => {

    //const prod = req.body; 

    //console.log(prod.title);
    
    var cid = parseInt(req.params.cid);
    var pid = parseInt(req.params.pid);
    
    const response = carts.addproductCart(cid, pid)

    res.status(200).send(response);
})

export default router; 