import ProductManagerMongo from './productsManagerMongo.js';
const productos = new ProductManagerMongo(); //instanciamos clase que maneja productos
import { cartsModel } from '../../dao/models/cartsmodels.js';
import carts from '../../repository/servicescart.js';
import products from '../../repository/servicesproducts.js';

const servicescarts = new carts();

class CartManagerMongo {

    async addProductCart(idCart, idProduct) {

        console.log("Estamos en addProductCart");
        console.log(idProduct);
        console.log(idCart);

        if (idCart == null) {

            let quantity_init = 1;
            console.log(idCart); 
            const cartcreate = await servicescarts.create(idCart, idProduct, quantity_init); 

            /*const cartcreate = await cartsModel.create({
                Products: {
                    product: idProduct,
                    quantity: quantity_init,
                }
            });*/

            //console.log(cartcreate); 

        } else {

            console.log("Entro en el else");

            let cart = new Array();
            cart = await servicescarts.findbyID(idCart);
            /*cart = await cartsModel.findById({
                _id: idCart,
            });*/

            console.log(cart);

            if (cart) {
                console.log("entro a ese if");
                let product_find = await cart.Products.find(prod => prod.product == idProduct);
                console.log(product_find);

                if (product_find) {

                    product_find.quantity += 1;

                    //const sum_quantity = quantity + 1; 

                    cart.save();
                    //console.log(cart); 

                } else {

                    console.log("Entro al segundo else");
                    let quantity_init = 1;

                    cart.Products.push({ product: idProduct, quantity: 1 });
                    cart.save();
                }

            } /*else {

                let quantity_init = 1;

                cart.Products.push({ product: idProduct, quantity: quantity_init });

            }*/



            // cart.Products.insertOne({product: idProduct})


        }


        /*let cart = new Array(); 

        cart = await cartsModel.find({
            _id: idCart,
        });

        console.log(cart); 

        cart.Products.push({product: "650f5d6b6ae42ee5b35b2129"}); 
        let result = await cartsModel.updateOne({
            _id: idCart,
        }, cart); */


    }

    async createcart() {
        //console.log(idCart);
        //console.log(idProduct); 
        //let cartobject = {};
        console.log("Creo carro");

        const cart = await servicescarts.createnewcart();
        //const cart = await cartsModel.create(cartobject);

        console.log(cart);

        return cart;
    }

    async deleteProduct(cid, pid) {

        console.log("Entro a borrar producto de carrito");

        console.log(cid);
        console.log(pid);

        //const deleteprod = await cartsModel.findOneAndUpdate({ "_id": cid}, { $pull: { "Products.product": { _id: pid } } });

        //const deleteprod = await cartsModel.findOneAndDelete({ "_id": cid}, { $pull: { "Products.product": { _id: pid } } });
        const deleteprod = await servicescarts.deleteproductfromcart(cid, pid); 

        //const deleteprod = await cartsModel.findOneAndUpdate({ "_id": cid}, { $pull: { Products: { _id: pid } } });
        //const deleteprod = await cartsModel.findOneAndDelete({ "_id": cid});

        /*const deleteprod = await cartsModel.findOneAndUpdate(
 
         {
       
           _id: interaction.user.id,
       
         },
       
         profile
       
       );*/

        return deleteprod;


    }

    async updateCart(cid, pid, quantitybody) {
        //console.log(idCart);
        //console.log(idProduct); 
        //let cartobject = {};
        console.log("Update carro");
        //const updateprod = await cartsModel.findOneAndUpdate({ "_id": cid, Products: { product: pid } }, { $set: { Products: { quantity: quantitybody } } });

        /*let updateprod = await cartsModel.updateOne({
            "_id": cid,
            "Products.product": pid
          }, {
            $set: {
              "Products.$.quantity": quantitybody
            }
          })*/

        let updateprod = await servicescarts.updatecart(cid, pid, quantitybody);

        //console.log(cart);

        return updateprod;
    }


    async getCartProducts(cid) {

        console.log("Entro a traer todos los productos del carrito con populate");

        console.log(cid);

        /*const populateCartprod = await cartsModel.find({_id : cid}).populate('Products.product').lean();*/

        const populateCartprod = await servicescarts.getcartproducts(cid); 
 
        return populateCartprod;


    }


}


export default CartManagerMongo; //exportamos clase CartManagerMongo
