import nodemailer from "nodemailer";
//import config from '../config/config.js';
import dotenv from 'dotenv';  

dotenv.config();

class mailing {

    async usemailing(email) {

        var transporter = nodemailer.createTransport({
            //service: 'gmail',
            host: 'smtp.ethereal.email',
            auth: {
             user: 'anthony44@ethereal.email',
              pass: '1w1HtFSHHHTnWAACcW'
              /*user: process.env.EMAIL_MAILING,
              pass: process.env.PASSWORD_MAILING*/
            },
            tls: {
                rejectUnauthorized: false
            }
          });
          
          var mailOptions = {
            from: 'anthony44@ethereal.email',
            to: 'davidcoderhouse@gmail.com',
            subject: 'MI EMPRENDIMIENTO',
            text: 'Bienvenido a nuestro ecommerce MI EMPRENDIEMIENTO'
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });



    };
  
}; 

export default mailing;