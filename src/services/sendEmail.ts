import { InternalServerErrorException } from '@nestjs/common';
import * as Email from 'email-templates';
import { createTransport } from 'nodemailer';

const emailFrom = 'contactokurodev@gmail.com';

const transporterConfig = {
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: emailFrom, // usuario del correo
    pass: 'E2rZpTwJ5qj4Zpy', // generated ethereal password
  },
  tls: {
    rejectUnauthorized: false,
  },
};

export const sendEmail = async (
  to: string,
  subject: string,
  pugTemplate: string,
  data?: any,
) => {
  try {
    const transporter = createTransport(transporterConfig);

    const email = new Email();

    const html = await email.render(pugTemplate, data || {});

    const mailOptions = {
      from: emailFrom,
      to,
      subject,
      html,
    };

    const msg = await transporter.sendMail(mailOptions);

    // console.log(msg);
  } catch (error) {
    console.log(error);
    throw new InternalServerErrorException('error to send email');
  }
};
