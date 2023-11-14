import { Router } from 'express';

import CartManagerMongo from '../controllers/mongo/cartsManagerMongo.js';
import TicketManagerMongo from '../controllers/mongo/ticketManagerMongo.js';

const router = Router();

//const pm = require("./ProductManager.js");

//app.use(express.urlencoded({ extended: true }));
//app.use(express.json());

const carritosMongo = new CartManagerMongo();
const ticket = new TicketManagerMongo(); 

router.get("/", async (req, res) => {
    res.render("realTimeProducts", {
    })
})

router.delete("/carts/:cid/products/:pid", async (req, res) => {

    //var cid = parseInt(req.params.cid);
    //var pid = parseInt(req.params.pid);

    var cid = req.params.cid;
    var pid = req.params.pid;

    console.log(cid);
    console.log(pid);

    const response = await carritosMongo.deleteProduct(cid, pid);



    return res.send(response);
})

router.put("/carts/:cid/products/:pid", async (req, res) => {

    //var cid = parseInt(req.params.cid);
    //var pid = parseInt(req.params.pid);

    var cid = req.params.cid;
    var pid = req.params.pid;
    var quantity = parseInt(req.body.quantity);
    console.log(cid);
    console.log(pid);
    console.log(quantity);

    const response = await carritosMongo.updateCart(cid, pid, quantity);



    return res.send(response);
})

router.delete("/carts/:cid", async (req, res) => {

    //var cid = parseInt(req.params.cid);
    //var pid = parseInt(req.params.pid);

    var cid = req.params.cid;
    //var pid = req.params.pid;

    console.log(cid);
    //console.log(pid); 

    const response = await carritosMongo.deleteCartProducts(cid);



    return res.send(response);
})

function returncid(cid){
    return cid; 
}

router.get("/carts/:cid", async (req, res) => {

    //var cid = parseInt(req.params.cid);
    //var pid = parseInt(req.params.pid);

    var cid = req.params.cid;
    //var pid = req.params.pid;

    console.log(cid);
    //console.log(typeof(cid));
    //console.log(pid); 

    //returncid(cid); 

    const response = await carritosMongo.getCartProducts(cid);



    return res.send(response);
})

router.get("/products/:cid", async (req, res) => {

    var cid = req.params.cid;
    const response = await carritosMongo.getCartProducts(cid);

    console.log("Imprime response"); 
    const str = JSON.stringify(response);
    console.log(str); 

    const str2 = JSON.parse(str); 

    console.log(str2[0]); 
    /*res.render("ViewsCarts", {
        cid : cid,
        response : response,

    });*/

    const response2 = response[0]; 

    res.render("ViewsCarts", { response2 });

    //var cid = parseInt(req.params.cid);
    //var pid = parseInt(req.params.pid);

    //var cid = req.params.cid;
    //var pid = req.params.pid;

    //console.log(cid); 
    //console.log(pid); 

    //return cid; 

    //returncid(cid); 

    

    //return res.send(response);
})


router.post("/:cid/purchase", async (req, res) => {

    var cid = req.params.cid;
    //var pid = parseInt(req.params.pid);

    /*var cid = req.params.cid;
    var pid = req.params.pid;*/

    console.log(cid);
    //console.log(pid);

    const objectsession  = req.session;

    console.log(objectsession.email);
    
    const purchaser = objectsession.email; 

    const ticketcreator = await ticket.createticket(purchaser); //llamamos funcion que crea ticket

    console.log(ticketcreator); 


    return res.send("PURCHASE");
})

export default router;