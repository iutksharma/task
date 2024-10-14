// src/services/emailService.js

import nodemailer from 'nodemailer';
import hbs from 'hbs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import config from '../common/config/envConfig.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    // user: config.EMAIL,
    user: "sparkgamingbuddy@gmail.com" ,
    // pass: config.PASSWORD,
    pass: "autx ihda dcjf wrgb"
  },
});

// Function to send email
const sendEmailSMTP = async (to, subject, templateName, templateData) => {
  // Load the Handlebars template
  const templatePath = path.join(__dirname, '../templates', `${templateName}.hbs`);
  const templateSource = fs.readFileSync(templatePath, 'utf8');

  // Compile the template
  const template = hbs.compile(templateSource);
  const html = template(templateData);

  // Email options
  const mailOptions = {
    from: config.EMAIL,
    to: to,
    subject: subject,
    html: html,
  };

  try {
    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
    if(info){
        return true;
    }
    return false;
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

export default sendEmailSMTP;
