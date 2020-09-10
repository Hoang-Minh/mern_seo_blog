const { sendMail } = require("../helpers/mail");
const keys = require("../config/keys");

exports.contactForm = (req, res) => {
  const { email, name, message } = req.body;

  const msg = {
    to: keys.ADMIN_EMAIL,
    from: req.body.email,
    subject: `Contact From - ${keys.APP_NAME}`,
    text: `Email received from contact from \n Sender name: ${name}\n Sender email: ${email}\n Sender message: ${message}`,
    html: `
    <h4>Email received from contact form:</h4>
    <p>Sender name: ${name}</p>
    <p>Sender email: ${email}</p>
    <p>Sender message: ${message}</p>
    <hr />
    <p>This email may contain sensitive information</p>
    `,
  };

  sendMail(msg);
  res.json({ success: true });
};

// check this !!!
exports.contactBlogAuthorForm = async (req, res) => {
  const { authorEmail, email, name, message } = req.body;

  const mailList = [authorEmail, keys.ADMIN_EMAIL];

  const msg = {
    to: mailList,
    from: email,
    subject: `Someone messaged you from - ${keys.APP_NAME}`,
    text: `Email received from contact from \n Sender name: ${name}\n Sender email: ${email}\n Sender message: ${message}`,
    html: `
      <h4>Message received from</h4>
      <p>Name: ${name}</p>
      <p>Email: ${email}</p>
      <p>Message: ${message}</p>
      <hr />
      <p>This email may contain sensitive information</p>
      `,
  };

  sendMail(msg);
  res.json({ success: true });
};
