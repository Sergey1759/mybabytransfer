const nodemailer = require("nodemailer");

async function main(email, subject, text, html) {
    let testAccount = await nodemailer.createTestAccount();

    let transporter = nodemailer.createTransport({
        host: "klifcom.net",
        port: 465,
        secure: true,
        auth: {
            user: 'zakaz@babytransfer.com',
            pass: 'B7q4G3k1',
        },
    });

    let info = await transporter.sendMail({
        from: '"BabyTransfer" <zakaz@babytransfer.com>',
        to: email,
        subject: subject,
        text: text,
        html: html,
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

module.exports = main;