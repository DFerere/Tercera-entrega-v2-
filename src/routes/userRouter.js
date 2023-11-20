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

dotenv.config();

const router = Router();

const users = new userManager();

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

router.get('/viewsendemail', async (req, res) => {

    res.render('SendEmail');

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

        if (req.session.rol === 'user') {
            res.redirect('/ecommerce/user/user'); 
        } else {
            res.redirect('/ecommerce/user/admin'); 
        };


    }
);

router.get('/user', userpermissionsRoutes, async (req, res) => {


    req.session.first_name = req.user.first_name;
    req.session.last_name = req.user.last_name;
    req.session.email = req.user.email;
    req.session.age = req.user.age;
    req.session.rol = req.user.rol;
    req.session.idcart = req.user.idcart;
    req.session.isLogged = true;

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

    res.render('home_user');

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
