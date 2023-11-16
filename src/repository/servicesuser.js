import { Router } from 'express';
import { usersModel } from '../dao/models/usermodels.js';
import { productsModel } from '../dao/models/productsmodels.js';
import passport from 'passport';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

dotenv.config();

class user {

    async find(username) { 

        const Exists = await usersModel.findOne({ email: username });

        return Exists; 

    }

    async create(first_name, last_name, email, age, password, rol, cart){
        console.log(cart); 
        const user = await usersModel.create({
            first_name,
            last_name,
            email,
            age,
            password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
            rol,
            cart
        });

        return user; 
    }

    async findOne (username){

        const user = await usersModel.findOne({ email: username }).lean();
        return user; 

    }


}

export default user; 


