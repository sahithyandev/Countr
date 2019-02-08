import * as functions from 'firebase-functions';

// exports.sendMail = functions.database.ref(`/feedback/`).onWrite(event => {

//     var emailjs = require('emailjs/email');

//     var server = emailjs.server.connect({
//         user: "levo21548@gmail.com",
//         password: "Sahithyan27012004",
//         host: "smtp.gmail.com",
//         port: 465,
//         ssl: true
//     });
//     console.log('server');

//     server.send({
//         text: 'Feedback received from : ',
//         from: "Support",
//         to: "sahithyan2701@gmail.com",
//         subject: "Feedback "
//     }, (err: any, message: any) => {
//         console.log(err || message);
//     });
// });

exports.sendMail = functions.https.onRequest((request, response) => {
    console.log(request);
    console.log(response);
    
});