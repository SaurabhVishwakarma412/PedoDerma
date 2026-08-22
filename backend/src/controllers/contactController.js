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

  const smtpHost = process.env.SMTP_SERVER;
  const smtpPort = Number(process.env.SMTP_PORT || 587);
  const smtpUser = process.env.SMTP_LOGIN;
  const smtpPassword = process.env.SMTP_KEY;
  const mailTo = process.env.CONTACT_EMAIL || smtpUser;

  if (!nodemailer || !smtpHost || !smtpUser || !smtpPassword || !mailTo) {
    console.warn("Contact email is not configured. Set SMTP_SERVER, SMTP_PORT, SMTP_LOGIN, SMTP_KEY, and CONTACT_EMAIL.");
    return res.status(503).json({
      error: "Contact email is not configured on the server.",
    });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPassword,
      },
    });

    const mailOptions = {
      from: smtpUser,
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
