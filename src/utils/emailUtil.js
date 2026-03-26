const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, html }) => {
  try {
    // These should be in .env
   const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",   // ✅ correct SMTP
  port: 465,                    // ✅ use 465
  secure: true,                 // ✅ MUST be true for 465
  auth: {
    user: process.env.SMTP_USER, // your full email
    pass: process.env.SMTP_PASS, // your email password
  },
});

    const mailOptions = {
      from: `"Nabhira Technologies" <${process.env.SMTP_USER || 'deepsikha.rk@hutechsolutions.in'}>`,
      to,
      subject,
      html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    return { success: true, info };
  } catch (error) {
    console.error('Email error:', error);
    return { success: false, error };
  }
};

module.exports = { sendEmail };
