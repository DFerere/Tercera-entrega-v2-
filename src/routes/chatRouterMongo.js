import { Router } from 'express';

//import ChatManagerMongo from '../dao/mongo/chatManagerMongo.js';

const router = Router(); 

//const pm = require("./ProductManager.js");

//app.use(express.urlencoded({ extended: true }));
//app.use(express.json());

//const productosMongo = new CartManagerMongo(); 

router.get("/",  async (req, res) => {
    
    res.render("Chat", {
    })
})

export default router;