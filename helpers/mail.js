const nodemailer = require("nodemailer");
const keys = require("../config/keys");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: keys.ADMIN_EMAIL,
    pass: keys.ADMIN_PASSWORD,
  },
});

exports.sendMail = async (mailOptions) => {
  await transporter.sendMail(mailOptions);
};
