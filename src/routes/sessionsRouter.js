import { Router } from 'express';
import privateRoutes from '../middlewares/privateroutes.js';
import CustomError from '../repository/errors/CustomError.js';
import EErrors from '../repository/errors/EErrors.js';
import { generateRegisterUserErrorInfo, generateUserErrorInfo } from '../repository/errors/Info.js';

const router = Router(); 

/*router.get('/login2', async (req, res)  => { //entra a vista de login

    res.render('login');
});*/

router.get('/login', async (req, res)  => { //entra a vista de login

    if(req.session.isLogged){
        return res.redirect('/ecommerce/home/profile'); 
    };

    res.render('login');
});


router.get('/signup', async (req, res)  => { //entra a vista de signup

    if(req.session.isLogged){
        return res.redirect('/ecommerce/home/profile'); 
    };

    res.render('signup');
});


router.get('/profile', async (req, res)  => { //entra a vista de login

    const { username, email } = req.session;
    console.log(username);

    if(!req.session.isLogged){
        return res.redirect('/ecommerce/home/login'); 
    };

    res.render('profile', { username, email});
});

router.get('/logout', async (req, res)  => { //entra a vista de login

    req.session.destroy(); 

    res.redirect('/ecommerce/home/login');
});

router.get("/failurelogin", async (req, res) => {
    const email = req.body.email; 
    if(!email){
        CustomError.createError({
            name: "Email errado",
            message: "Error de login", 
            cause: generateUserErrorInfo({email}),
            code: EErrors.INVALID_TYPE_ERROR
        })
    }

    res.send("Sorry :( credenciales incorrectas"); 
})

router.get("/failregister", async (req, res) => { 

    const {first_name, last_name, username, email, age}  = req.body; 
    if(!email || !first_name || !last_name || age || !username){
        CustomError.createError({
            name: "Error en dato de registro",
            message: "Error error registrandose", 
            cause: generateRegisterUserErrorInfo({email, first_name, last_name, age}),
            code: EErrors.INVALID_TYPE_ERROR
        })
    }

    res.send("Caramba algo salio mal con el resgitro, al parecer tu correo ya existe"); 
})

router.get("/current", async (req, res) => {
   
    const objectsessionDTO  = req.session;
    console.log("este es req session"); 
    console.log(req.session.email);

    res.send(objectsessionDTO); 
})

export default router; 

