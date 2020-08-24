const sgMail = require('@sendgrid/mail')
// const { getMaxListeners } = require('../models/task')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email,name) => {
    sgMail.send({
        to:email,
        from:'bhavjot794@gmail.com',
        subject:'Thanks for joining in!',
        text:`Welcome to the app, ${name}.Let me know how you get along the app`
    })
}
const sendCancelEmail = (email,name) => {
    sgMail.send({
        to:email,
        from:'bhavjot794@gmail.com',
        subject:'Sorry to see you unsubscribed',
        text:`Goodbye , ${name}. I hope to see you soon`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelEmail
    }

// sgMail.send({
//     to: 'singhiqbal279@gmail.com',
//     from:'bhavjot794@gmail.com',
//     subject:'this is my first creation!',
//     text:'I hope this one actually get to you'
// })