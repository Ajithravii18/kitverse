import nodemailer from 'nodemailer';
import { problem } from '../order-service.js';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export async function sendOtpEmail(email, otp, actionType = 'Verification') {
  if (!process.env.SMTP_USER) {
    if(process.env.NODE_ENV==='production') throw problem(503,'Email delivery is not configured.');
    console.log(`\n=================================================`);
    console.log(`[MOCK EMAIL] OTP for ${email}: ${otp}`);
    console.log(`(Configure SMTP_USER and SMTP_PASS in .env to send real emails)`);
    console.log(`=================================================\n`);
    return;
  }
  try {
    await transporter.sendMail({
      from: `"KITVERSE Archive" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `Your KITVERSE ${actionType} Code`,
      text: `Your one-time ${actionType.toLowerCase()} code is: ${otp}\nThis code expires in 15 minutes.`,
      html: `
        <div style="font-family: 'Courier New', Courier, monospace; max-width: 600px; margin: 0 auto; background-color: #1c1b1c; color: #ffffff; padding: 40px 20px; text-align: center; border: 1px solid #313031;">
          <div style="margin-bottom: 30px;">
            <h2 style="margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #ffffff;">KITVERSE</h2>
            <p style="margin: 5px 0 0 0; font-size: 10px; letter-spacing: 4px; color: #888888; text-transform: uppercase;">Atelier Specimen Series</p>
          </div>
          
          <div style="background-color: #ffffff; color: #1c1b1c; padding: 40px 20px; margin: 0 auto; max-width: 400px;">
            <p style="margin: 0 0 15px 0; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: #666666;">${actionType} Code</p>
            <h1 style="margin: 0; font-size: 48px; font-weight: 800; letter-spacing: 8px; color: #1c1b1c;">${otp}</h1>
          </div>
          
          <div style="margin-top: 30px; border-top: 1px solid #313031; padding-top: 20px;">
            <p style="margin: 0; font-size: 11px; color: #888888; text-transform: uppercase; letter-spacing: 1px;">This secure token expires in 15 minutes.</p>
            <p style="margin: 10px 0 0 0; font-size: 11px; color: #666666;">If you did not request archive access, please ignore this dispatch.</p>
          </div>
        </div>
      `
    });
    console.log(`Sent real OTP email to ${email}`);
  } catch (err) {
    console.error(`Failed to send OTP email: ${err.message}`);
    throw problem(503,'Email could not be delivered. Please request a new code.');
  }
}
