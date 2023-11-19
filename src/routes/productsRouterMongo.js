import { Router, response } from 'express';

import ProductManagerMongo from '../controllers/mongo/productsManagerMongo.js';
import products from '../repository/servicesproducts.js';
import productsfakermanager from '../controllers/ProductsManagerFake.js';
import CustomError from '../repository/errors/CustomError.js';
import EErrors from '../repository/errors/EErrors.js';
import { generateRegisterUserErrorInfo, generateUserErrorInfo, generateCreateProductErrorInfo } from '../repository/errors/Info.js';


const router = Router();

const productosMongo = new ProductManagerMongo();
const faker = new productsfakermanager();


const serviceproducts = new products();

/*View de productos catalogo paginaciçion*/
router.get("/catalog", async (req, res) => {

    const objectsession = req.session;
    console.log("este es req session");
    console.log(req.session);

    const objectId_ = req.session.cart[0]._id;


    console.log(objectId_);

    res.render("ViewsProducts", { objectId_, objectsession });
})

router.get("/mockingproducts", async (req, res) => {

    const objectsession = req.session;

    const products = await faker.generator();

    res.render("mockingproducts", { products, objectsession });
    
})



router.get("/failurelogin", async (req, res) => { //vista de falla de login

    res.send("Sorry :( credenciales incorrectas");
})

router.get('/management', async (req, res) => { //redirecciona a vista de gestion de productos

    res.render('productsmanagement');
})

router.post('/management/create', async (req, res) => { //creas productos

    const title = req.body.title;
    const description = req.body.description;
    const price = req.body.price;
    const thumbnail = req.body.thumbnail;
    const code = req.body.code;
    const stock = req.body.stock;
    const status = req.body.status;
    const category = req.body.category;

    console.log(title);
 
    if(!title || !description || !price || !thumbnail || !code || !stock || !status || !category){
        CustomError.createError({
            name: "Error en dato de creacion de producto",
            message: "Error creando producto", 
            cause: generateCreateProductErrorInfo({title}),
            code: EErrors.INVALID_TYPE_ERROR
        })
    }

    try {
        const create = await serviceproducts.create(title, description, price, thumbnail, code, stock, status, category);
        return res.redirect('/mongo/products/management');
    } catch {
        res.send("Hubo un error creando el producto");
    };
})

router.delete("/management/delete", async (req, res) => { //borras productos

    console.log("Entramos a delete");
    console.log(req.body.id);
    const objectsession = req.session;
    console.log("este es req session");
    console.log(req.session.email);

    const id = req.body.id;

    try {
        const deleteproduct = await serviceproducts.deleteproducts(id);

    } catch {
        res.send("Hubo un error eliminando el producto");
    };

})

router.put("/management/update", async (req, res) => { //actualiza productos

    const objectsession = req.session;
    console.log("este es req session");
    console.log(req.session.email);

    const id = req.body.id;
    const element = req.body.element;
    const value = req.body.value;

    try {
        const deleteproduct = await serviceproducts.updateproducts(id, element, value);

    } catch {
        send.res("Hubo un error actualizando el producto");
    };

})

router.get("/current", async (req, res) => {

    const objectsession = req.session;
    console.log("este es req session");
    console.log(req.session.email);

    res.send(objectsession);
})


/*Paginación*/
router.get('/', async (req, res) => { //trae lista de productos con param limit, page, query y sort

    var page = req.query.page;
    var limit = req.query.limit;
    var query = req.query.query;
    var queryvalue = req.query.queryvalue;
    var sortvalue = req.query.sortvalue;

    parseInt(page);
    parseInt(limit);
    parseInt(sortvalue);
    console.log(page);
    console.log(query);
    console.log(queryvalue);
    console.log("Entre a GET de numero de Paginas");

    if (!sortvalue) {
        sortvalue = 1;
    }

    if (!page && !limit && !query) {
        const pageconst = 1;
        const limitconst = 10;
        const query = {};
        const response = await productosMongo.getpageProducts(query, pageconst, limitconst, sortvalue);
        return response;
        return res.send(response); //Habilitar si usa Postman
    }

    if (page && !limit && !query) {
        //const pageconst = 1;
        const limitconst = 10;
        const query = {};
        const response = await productosMongo.getpageProducts(query, page, limitconst, sortvalue);
        return res.send(response);
    }

    if (!page && limit && !query) {
        const pageconst = 1;
        const query = {};
        const response = await productosMongo.getpageProducts(query, pageconst, limit, sortvalue);
        return res.send(response);
    }

    if (!page && !limit && query) {
        const pageconst = 1;
        const limitconst = 10;
        const queryobject = { category: queryvalue };
        console.log(queryobject);
        const response = await productosMongo.getpageProducts(queryobject, pageconst, limitconst, sortvalue);
        return res.send(response);
    }

    if (page && limit && !query) {
    
        const query = {};
        const response = await productosMongo.getpageProducts(query, page, limit, sortvalue);
        return res.send(response);
    }

    if (!page && limit && query) {
        const pageconst = 1;
        const queryobject = { category: queryvalue };
        const response = await productosMongo.getpageProducts(queryobject, pageconst, limit, sortvalue);
        return res.send(response);
    }

    if (page && !limit && query) {
        const limitconst = 10;
        const queryobject = { category: queryvalue };
        const response = await productosMongo.getpageProducts(queryobject, page, limitconst, sortvalue);
        return res.send(response);
    } else {
        const queryobject = { category: queryvalue };
        const response = await productosMongo.getpageProducts(queryobject, page, limit, sortvalue);
        return res.send(response);
    }

})


export default router; 
