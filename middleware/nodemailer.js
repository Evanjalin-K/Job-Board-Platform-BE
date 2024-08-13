const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'etest2882@gmail.com', 
        pass: 'lmin eppu cgbk gnoz' 
    }
});

const sendEmail = (to, subject, text) => {
    const mailOptions = {
        from: 'etest2882@gmail.com',
        to: to,
        subject: subject,
        text: text
    };

    return transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
