/* eslint-disable class-methods-use-this */

const nodemailer = require('nodemailer');

// const sendEmail = async options => {
//   const transporter = nodemailer.createTransport({
//     host: process.env.EMAIL_HOST,
//     port: process.env.EMAIL_PORT,
//     auth: {
//       user: process.env.EMAIL_USERNAME,
//       pass: process.env.EMAIL_PASSWORD
//     }
//   });

//   const mailOptions = {
//     from: 'Stuart Huggins <huggins@tuta.io>',
//     to: options.email,
//     subject: options.subject,
//     text: options.message
//   };

//   await transporter.sendMail(mailOptions);
// };

// module.exports = sendEmail;

module.exports = class Email {
  constructor(user) {
    this.to = user.email;
    this.name = user.name;
    this.from = `Stuart Huggins <${process.env.EMAIL_FROM}>`;
  }

  createTransport() {
    if (process.env.NODE_ENV === 'production') {
      // sendgrid
      return 1;
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  async send(subject, text) {
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      text
    };

    await this.createTransport().sendMail(mailOptions);
  }

  async sendPasswordReset(resetUrl) {
    const text = `Hi, ${this.name}! Visit the following link to reset your password. It expires in 10 minutes.\n\n${resetUrl}`;
    await this.send('Password reset', text);
  }
};
