import nodemailer from "nodemailer";

let transporter;

export default () =>
  (transporter = nodemailer.createTransport({
    host: process.env.MAILER_SMTP_SERVER,
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAILER_SMTP_USERNAME,
      pass: process.env.MAILER_SMTP_PASSWORD,
    },
  }));

export { transporter };
