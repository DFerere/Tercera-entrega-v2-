import { Router } from 'express';
import { usersModel } from '../dao/models/usermodels.js';
import passport from 'passport';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

import mailing from '../services/email.js';

dotenv.config();
const usermailing = new mailing();

class userManager {

    async registeruser(username, email, password) {

        const userExists = await usersModel.findOne({ email });

        if (userExists) { //validamos si usuario ya existe en la BD
            return res.send("El usuario ya existe");
        }

        if (email == process.env.ADMIN_EMAIL_1 || email == process.env.ADMIN_EMAIL_2) {
            const rol = "admin";
            const user = await usersModel.create({ username, email, password, rol });
            console.log(username);
            return; 
        } else {
            const rol = "user";
            const user = await usersModel.create({ username, email, password, rol });
            console.log(username);
            return;
        }

    }; 

    async useremail(email) {

        const userExists = await usersModel.findOne({ email });

        if (userExists){
            //llamamos a servicio de envio de correo
            await usermailing.usemailing(); 

        }else {
            return "Correo enviado"; 
        }



    }

}

export default userManager;

