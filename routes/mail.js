const API_KEY = process.env.API_KEY;
const DOMAIN = process.env.DOMAIN;

const mailgun = require('mailgun-js')
       ({apiKey: API_KEY, domain: DOMAIN});

const sendMail = function(sender_email, reciever_email, email_subject, email_body){

                const data = {
                           "from": sender_email,
                           "to": reciever_email,
                           "subject": email_subject,
                           "text": email_body
                           };

                           mailgun.messages().send(data, (error, body) => {
                           if(error) console.log(error)
                           else console.log("Mailed Sent Successful: "+body);
                           });
                   };

module.exports = sendMail;
