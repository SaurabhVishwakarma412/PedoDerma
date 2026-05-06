let nodemailer;

try {
  nodemailer = require("nodemailer");
} catch {
  nodemailer = null;
}

const sendContactEmail = async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: "All required fields must be filled." });
  }

  const mailUser = process.env.MAIL_USER;
  const mailPass = process.env.MAIL_PASS;
  const mailTo = process.env.CONTACT_EMAIL || mailUser;

  if (!nodemailer || !mailUser || !mailPass || !mailTo) {
    console.warn("Contact email is not configured. Set MAIL_USER, MAIL_PASS, and install nodemailer.");
    return res.status(503).json({
      error: "Contact email is not configured on the server.",
    });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: mailUser,
        pass: mailPass,
      },
    });

    const mailOptions = {
      from: mailUser,
      replyTo: email,
      to: mailTo,
      subject: `Contact Form Submission: ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone || "N/A"}\nMessage: ${message}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Email sent successfully." });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send email." });
  }
};

module.exports = { sendContactEmail };
