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
    idcart: String
})

usersSchema.plugin(mongoosePaginate); 
const usersModel = mongoose.model(usersCollections, usersSchema); 

export {usersModel}; 