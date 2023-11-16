import mongoose from "mongoose";

import mongoosePaginate from "mongoose-paginate-v2"; 

const usersCollections = "users"; 

const usersSchema = new mongoose.Schema({

    first_name : String, 
    last_name: String,
    username: String, 
    email: String,
    age: Number, 
    password: String,
    rol : String,
    cart: {
        type: [
            {
                id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'carts',
                }
            }
        ], default: null
    }
})

usersSchema.plugin(mongoosePaginate); 
const usersModel = mongoose.model(usersCollections, usersSchema); 

export {usersModel}; 