// emailHelper.js
import nodemailer from 'nodemailer';

const emailConfig = {
  service: 'gmail',
  auth: {
    user: 'clubhubbofficial@gmail.com', // Replace with your email
    pass: 'esos zitz uhfw rdxe', // Replace with your email password
  },
};


const transporter = nodemailer.createTransport(emailConfig);

export const sendPasswordResetCodeEmail = async (email, resetCode) => {
  try {
    const mailOptions = {
      from: 'clubhubbofficial@gmail.com', // Replace with your email
      to: email,
      subject: 'Password Reset Code',
      text: `Your password reset code is: ${resetCode}`,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log('Email sent:', info.response);

    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};


 
// Function to send event registration confirmation email
export const sendEventRegistrationConfirmationEmail = async (email, eventName, qrCodeBase64) => {
  try {
    const mailOptions = {
      from: 'clubhubbofficial@gmail.com', // Replace with your email
      to: email,
      subject: 'Event Registration Confirmation',
      html: `
        <p>Thank you for registering for the event "${eventName}".</p>
          <p>For more events and updates, please visit our website: <a href="https://daksha30.com/">Daksha 3.0</a></p>

      `,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log('Event registration confirmation email sent:', info.response);

    return true;
  } catch (error) {
    console.error('Error sending event registration confirmation email:', error);
    return false;
  }
};

