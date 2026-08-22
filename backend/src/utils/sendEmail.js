const nodemailer = require("nodemailer");

const sendEmail = async ({ to, subject, text, html }) => {
  const mailUser = process.env.MAIL_USER || process.env.SMTP_LOGIN;
  const mailPass = process.env.MAIL_PASS || process.env.SMTP_KEY;
  const smtpHost = process.env.SMTP_SERVER;
  const smtpPort = Number(process.env.SMTP_PORT || 587);
  const fromAddress = process.env.MAIL_FROM || mailUser;

  if (!mailUser || !mailPass) {
    throw new Error("SMTP is not configured. Set MAIL_USER/MAIL_PASS or SMTP_LOGIN/SMTP_KEY.");
  }

  const transporter = nodemailer.createTransport(smtpHost ? {
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: { user: mailUser, pass: mailPass },
  } : {
    service: "gmail",
    auth: { user: mailUser, pass: mailPass },
  });

  const mailOptions = {
    from: fromAddress,
    to,
    subject,
    text,
    html,
  };

  await transporter.sendMail(mailOptions);
  return { success: true };
};

module.exports = sendEmail;
