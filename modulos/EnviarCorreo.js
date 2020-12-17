const nodemailer = require('nodemailer')


const enviarCorreo = async (to,subjet,html) =>{
    let transporter =  nodemailer.createTransport({
        service: "gmail",
        auth:{
            user: "nodemailerADL@gmail.com",
            pass: "desafiolatam"
        }
    })
    let mailOptions = {
        from: 'nodemailerADL@gmail.com',
        to,
        subjet,
        html

    }
    try {        
        await transporter.sendMail(mailOptions)
    } catch (error) {
        console.log('tuvimos un error')
        console.log(error)
    }
}

module.exports = enviarCorreo
