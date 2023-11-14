import mongoose from "mongoose";

const cartsCollections = "carts"; 

const cartsSchema = new mongoose.Schema({

    /*idProduct: {
        type: String,
        required: true
    },*/

    Products: {
        type: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "products"
                }, 

                quantity: {
                    type: Number,
                    required: true
                }

            }
        ],
        default:[]
    },

    

    /*quantity: {
        type: Number,
        required: true
    },*/

})

const cartsModel = mongoose.model(cartsCollections, cartsSchema); 

export {cartsModel}; 