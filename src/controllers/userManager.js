import { Router } from 'express';
import { usersModel } from '../dao/models/usermodels.js';
import passport from 'passport';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

import mailing from '../services/email.js';
import { logger } from '../utils/logger.js';

dotenv.config();
const usermailing = new mailing();

class userManager {

    async registeruser(username, email, password) {

        const userExists = await usersModel.findOne({ email });

        if (userExists) { //validamos si usuario ya existe en la BD
            logger.info('Usuario existe en base de datos ' + email);
            return res.send("El usuario ya existe");
        }

        if (email == process.env.ADMIN_EMAIL_1 || email == process.env.ADMIN_EMAIL_2) {
            const rol = "admin";
            const user = await usersModel.create({ username, email, password, rol });
            logger.info('Se registro usuario admin: ' + email);

            return;
        } else {
            const rol = "user";
            const user = await usersModel.create({ username, email, password, rol });
            logger.info('Se registro usuario regular: ' + email);
            return;
        }

    };

    async useremail(email) {

        const userExists = await usersModel.findOne({ email });

        if (userExists) {
            //llamamos a servicio de envio de correo
            logger.info('Se envio correo al usuario ' + email);
            await usermailing.usemailing();

        } else {
            logger.warning('usuario no existe: ' + email);
            return "Correo enviado";
        }



    }

    async useremailpassword(email, token) {

        const userExists = await usersModel.findOne({ email });

        if (userExists) {
            //llamamos a servicio de envio de correo
            await usermailing.changepasswordmailing(token);
            logger.info('Se envio correo de cambio de clave al usuario ' + email);


        } else {
            logger.warning('usuario no existe: ' + email);
            return "Correo enviado";
        }



    }

    async validatepassword(password, email) {

        console.log(email);
        console.log(password); 

        try {

            const userExists = await usersModel.findOne({ email });

            if(userExists){

                if (!bcrypt.compareSync(password, userExists.password)) {
                    return 1;
                } else {
                    logger.error("Contrasena nueva y vieja son las mismas del usuario: " + email);
                    return 2;
                }


            } else {

                logger.error("Usuario no existe");

            }

        } catch {
            info.error("Fallo el validar nueva contrasena");


        }


    }

    async changepassword(password, email) {

        console.log(email);
        console.log(password); 

        try {

            const userExists = await usersModel.findOne({ email });
            console.log(userExists);

            if(userExists){

                const newpassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

                userExists.password = newpassword;

                console.log(userExists);
                console.log(newpassword);

                await usersModel.updateOne({email : userExists.email}, {$set: {password: userExists.password}});


            } else {

                logger.error("Usuario no existe");

            }

        } catch {
            info.error("Fallo cambiar nueva contrasena");


        }


    }

    async changerol(email){

        try{

            const user = await usersModel.findOne({email}); 

            const rol = user.rol; 

            if (rol === "premium"){

                user.rol = "user";

                await usersModel.updateOne({email : user.email}, {$set: {rol: user.rol}});

                logger.info("Se cambio rol del usuario con exito: " + email);

            } else {

                user.rol = "premium";
                await usersModel.updateOne({email : user.email}, {$set: {rol: user.rol}});
                logger.info("Se cambio rol del usuario con exito: " + email);
            }

        } catch {

            logger.error("No se pudo cambiar rol del usuario: " + email);

        }

    }

}

export default userManager;

