import { productsModel } from '../../dao/models/productsmodels.js';
import products from '../../repository/servicesproducts.js'; 

const servicesproducts = new products();


class ProductManagerMongo {

    //Funcion para agregar productos
    async createproduct(title, description, price, thumbnail, code, stock, status, category) {

        const produ = await servicesproducts.create(title, description, price, thumbnail, code, stock, status, category); 
        /*const produ = await productsModel.create({
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
            status,
            category,
        })*/

        console.log(produ); 

        return produ;
    }

    async getallProducts(){

        const getprod = await servicesproducts.getallproducts(); 
        //const getprod = await productsModel.find().lean(); 
        //console.log(getprod); 
        return getprod; 
    }

    async getProducts(limit){

        const getprod = await servicesproducts.getproducts(limit); 
        //const getprod = await productsModel.find({}).limit(limit).exec().lean(); 
        return getprod; 
    }

    async getpageProducts(query, page, limit, sortvalue){
        console.log("Estoy en query"); 
        console.log(query); 
        console.log(page); 
        console.log(limit);
        console.log(sortvalue);
        
        const myCustomLabels = {
            totalDocs: 'itemCount',
            docs: 'payload',
            limit: 'limit',
            page: 'pagina',
            nextPage: 'next',
            prevPage: 'prev',
            totalPages: 'totalPages',
            pagingCounter: 'slNo',
            meta: 'paginator', 
          };

        const getprod = await productsModel.paginate(query, {limit: limit, page: page, sort: { _id: sortvalue, price: 1}, customLabels: myCustomLabels}); 
        //const stockprod = await productsModel.find({category}); 
       // console.log(stockprod); 
       /* if(getprod.stock == 0){
            return "El producto no esta Disponible";
        } else {
            return getprod; 
        }*/
        return getprod; 
        //sort({price: 1});
    }; 

    async deleteproducts (idproduct){

        const del = await servicesproducts.deleteproducts(idproduct); 
        return del;

    }; 

    async update (idproduct, update_element){
        const update = await servicesproducts.updateproducts(idproduct, update_element); 
        return update; 
    }

}

export default ProductManagerMongo;



