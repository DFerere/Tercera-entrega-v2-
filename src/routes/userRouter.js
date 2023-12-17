import { Router } from 'express';
import { usersModel } from '../dao/models/usermodels.js';
import userManager from '../controllers/userManager.js';
import passport from 'passport';
import dotenv from 'dotenv';
import privateRoutes from '../middlewares/privateroutes.js';
import userpermissionsRoutes from '../middlewares/authorization.js';
import adminpermissionsRoutes from '../middlewares/authorizationadmin.js';
import CustomError from '../repository/errors/CustomError.js';
import EErrors from '../repository/errors/EErrors.js';
import { generateUserErrorInfo } from '../repository/errors/Info.js';
import { logger } from '../utils/logger.js';
import TokenManagerMongo from '../controllers/mongo/tokenManagerMongo.js';

dotenv.config();

const router = Router();

const users = new userManager();
const tokens = new TokenManagerMongo(); 

router.post('/signup', async (req, res) => {

    const { username, email, password } = req.body;
    console.log(username);

    await users.registeruser(username, email, password);

    //guardamos info del usuario en session
    req.session.username = username;
    req.session.email = email;
    req.session.isLogged = true;

    res.redirect('/ecommerce/home/profile');



});

//ENVIAR CORREO A USUARIO MAILING
router.post('/sendemail', async (req, res) => {

    const { email } = req.body;
    console.log(email);
    await users.useremail(email);

    res.send("Correo enviado");



});

//VISTA PARA ENVIAR EMAIL

router.get('/viewsendemail', async (req, res) => {

    res.render('SendEmail');

});

//CAMBIO Y RECUPERACION DE CONTRASEÑA

router.get('/changepassword', async (req, res) => {

    res.render('changepass');

});

router.get('/recovery', async (req, res) => {

    res.render('recovery');

});

router.post('/recovery/newpassword', async (req, res) => {

    const { token, new_password} = req.body;
    //const { newpassword } = req.body;

    console.log(token);
    console.log(new_password);

    const response = await tokens.validatetoken(token, new_password);
    
    res.send(response);

});

router.post('/changepassword/email', async (req, res) => {

    const { email } = req.body;
    console.log(email);
    const token = await tokens.createtoken(email);
    console.log(token);
    await users.useremailpassword(email, token);
    res.send("Correo enviado");


});

//PARA CAMBIAR ROL DEL USUARIO

router.get('/rol', async (req, res) => {

    const email = req.session.email;

    try {

        await users.changerol(email);
        res.send("Se cambio rol con exito");

    } catch {

        logger.error("Fallo el cambio de rol"); 
        res.send("Fallo cambio de rol"); 

    }

});





//REGISTRO CON GITHUB
router.post('/signup_passport',
    passport.authenticate('register', { failureRedirect: '/api/sessions/failregister' }),
    async (req, res) => {
        res.redirect('/ecommerce/home/login');
    }
);

//LOGIN CON GITHUB

router.post('/login_passport',

    passport.authenticate('login', { failureRedirect: '/api/sessions/failurelogin' }),
    async (req, res) => {
        //guardamos info del usuario en session

        req.session.first_name = req.user.first_name;
        req.session.last_name = req.user.last_name;
        req.session.email = req.user.email;
        req.session.age = req.user.age;
        req.session.rol = req.user.rol;
        req.session.cart = req.user.cart;
        req.session.isLogged = true;

        const name = req.session.first_name;
        console.log(name);


        console.log(req.session.rol);
        logger.info('Usuario hizo login: ' + req.session.email); 

        if (req.session.rol === 'user') {
            
            try {
                res.redirect('/ecommerce/user/user');
                logger.info('Ingreso usuario'); 
            } catch {
                info.error("Fallo redirigir usuario"); 
            }
                  
            
        };
        
        if (req.session.rol === 'premium') {
            res.redirect('/ecommerce/user/premium');
            logger.info('Ingreso usuario premium');

        }
        
        if (req.session.rol === 'admin') {
            res.redirect('/ecommerce/user/admin');
            logger.info('Ingreso usuario administrador');  
        };


    }
);



//LOGIN CON GITHUB

//LOGIN DE TEST

router.post('/login_passport/test',

    passport.authenticate('login', { failureRedirect: '/api/sessions/failurelogin' }),
    async (req, res) => {
        //guardamos info del usuario en session

        req.session.first_name = req.user.first_name;
        req.session.last_name = req.user.last_name;
        req.session.email = req.user.email;
        req.session.age = req.user.age;
        req.session.rol = req.user.rol;
        req.session.cart = req.user.cart;
        req.session.isLogged = true;

        const name = req.session.first_name;
        console.log(name);

        const session_object = req.session; 


        console.log(req.session.rol);
        logger.info('Usuario hizo login: ' + req.session.email);
        
        logger.info('Usuario hizo logout: ' + req.session.email);

        req.session.destroy();

        res.send(session_object); 


    }
);

router.get('/user', async (req, res) => { 

    req.session.first_name = req.user.first_name;
    req.session.last_name = req.user.last_name;
    req.session.email = req.user.email;
    req.session.age = req.user.age;
    req.session.rol = req.user.rol;
    req.session.idcart = req.user.idcart;
    req.session.isLogged = true;

    logger.info("Entre a /user"); 

    res.render('home_user');

})

router.get('/admin', adminpermissionsRoutes, async (req, res) => {


    req.session.first_name = req.user.first_name;
    req.session.last_name = req.user.last_name;
    req.session.email = req.user.email;
    req.session.age = req.user.age;
    req.session.rol = req.user.rol;
    req.session.idcart = req.user.idcart;
    req.session.isLogged = true;

    res.render('home_admin');

})

router.get('/premium', adminpermissionsRoutes, async (req, res) => {


    req.session.first_name = req.user.first_name;
    req.session.last_name = req.user.last_name;
    req.session.email = req.user.email;
    req.session.age = req.user.age;
    req.session.rol = req.user.rol;
    req.session.idcart = req.user.idcart;
    req.session.isLogged = true;

    res.render('home_premium');

})

router.post('/login', async (req, res) => {

    const { email, password } = req.body;
    console.log(email);
    console.log(password);

    const user = await usersModel.findOne({ email, password }).lean();

    if (!user) { //validamos si usuario ya existe en la BD
        return res.send("Credenciales INVALIDAS");
    }

    //guardamos info del usuario en session
    req.session.username = username;
    req.session.email = user.email;
    req.session.isLogged = true;

    res.redirect('/mongo/products/catalog');


});

router.get(
    '/github',
    passport.authenticate('github', { scope: 'user : email' })
);

router.get(
    '/githubcallback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    (req, res) => {
        console.log("Voy a imprimir reques.user");
        console.log(req.user);
        req.session.first_name = req.user.first_name;
        req.session.last_name = req.user.last_name;
        req.session.email = req.user.email;
        req.session.age = req.user.age;
        req.session.isLogged = true;
        res.redirect('/mongo/products/catalog');
    });


export default router;
