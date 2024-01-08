import { Router } from 'express';
import { usersModel } from '../dao/models/usermodels.js';
import { productsModel } from '../dao/models/productsmodels.js';
import passport from 'passport';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { logger } from '../utils/logger.js';

dotenv.config();

class user {

    async find(username) { 

        const Exists = await usersModel.findOne({ email: username });

        return Exists; 

    }

    async create(first_name, last_name, email, age, password, rol, last_connection, cart, documents){
        console.log(cart);
        //const last_connection = "domingo"; 
        const user = await usersModel.create({
            first_name,
            last_name,
            email,
            age,
            password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
            rol,
            last_connection,
            cart, 
            documents
        });

        return user; 
    }

    async findOne (username){

        const user = await usersModel.findOne({ email: username }).lean();
        return user; 

    }

    async updateconnection(oneusername, thelast_connection){

        logger.info('Ingreso a update last connection'); 

        const user = await usersModel.findOneAndUpdate({ email : oneusername }, { last_connection : thelast_connection});
        return user;

    }

    async updatedocuments(email, filename, filepath){

        const objuser = await usersModel.findOne({ email: email });

        logger.info('Ingreso a actualizar estatus de los documentos cargados');
        
        console.log(filename);
        
        console.log("objeto de ususario"); 
        console.log(objuser); 

        let newdocument = {name : filename, reference : filepath}; 
        console.log(newdocument);
        console.log("objeto documento"); 
        console.log(newdocument); 

        objuser.documents.push(newdocument); 
        console.log("el nuevo objeto de ususario"); 
        console.log(objuser); 

        await usersModel.updateOne({
            email : email,
          }, {
            $set: {
              documents : objuser.documents
            }
          });

        //const user = await usersModel.findOneAndUpdate({ email : email }, objuser);
        return; 

    }


}

export default user; 


