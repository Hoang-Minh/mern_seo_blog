const sgMail = require("@sendgrid/mail");
const keys = require("../config/keys");
sgMail.setApiKey(keys.SENDGRID_API_KEY);

exports.contactForm = async (req, res) => {
  const { email, name, message } = req.body;

  console.log(req.body);

  const msg = {
    to: req.body.email,
    from: keys.FROM_EMAIL, // Use the email address or domain you verified above
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

  try {
    await sgMail.send(msg);
    res.json({ success: true });
  } catch (error) {
    console.log(error);

    if (error.response) {
      console.error(error.response.body);
    }
  }
};
