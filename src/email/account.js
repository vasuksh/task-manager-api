const sgMail=require('@sendgrid/mail')
if (process.env.NODE_ENV !== 'production') require('dotenv').config({path:'config/dev.env'})

sgMail.setApiKey(process.env.SENDGRIDAPI)

const WelcomeEmail=(email,name)=>{
    
    sgMail.send({
        to:email,
        from:'vasuksh433@gmail.com',
        subject:'Thanks for joining us',
        text:'Welcome to the app, '+ name+'. Let me know how you get along with the app.'
    })
}


const DeleteEmail=(email,name)=>{
    
    sgMail.send({
        to:email,
        from:'vasuksh433@gmail.com',
        subject:'Tusi ja rahe?',
        text:'Hey, '+ name+'. Let us know the reason to remove your account.We will be glad to help.'
    })
}


module.exports={
    WelcomeEmail,
    DeleteEmail
}