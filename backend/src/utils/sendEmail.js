const nodemailer = require("nodemailer");

const sendEmail = async ({ to, subject, text, html }) => {
  const mailUser = process.env.MAIL_USER;
  const mailPass = process.env.MAIL_PASS;

  if (!mailUser || !mailPass) {
    console.log("\n=======================================================");
    console.log("             [DEVELOPMENT] OUTGOING EMAIL LOG          ");
    console.log("=======================================================");
    console.log(`TO:      ${to}`);
    console.log(`SUBJECT: ${subject}`);
    console.log(`CONTENT:\n${text}`);
    console.log("=======================================================\n");
    return { success: true, loggedToConsole: true };
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: mailUser,
      pass: mailPass,
    },
  });

  const mailOptions = {
    from: mailUser,
    to,
    subject,
    text,
    html,
  };

  await transporter.sendMail(mailOptions);
  return { success: true };
};

module.exports = sendEmail;
