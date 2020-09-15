const User = require("../models/user");
const Blog = require("../models/blog");
const _ = require("lodash");
const shortId = require("shortid");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const expressJwt = require("express-jwt");
const keys = require("../config/keys");
const { sendMail } = require("../helpers/mail");

exports.preSignup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });

    if (user) return res.status(400).json({ error: "Email is taken" });
    const token = jwt.sign(
      { name, email, password },
      keys.JWT_ACCOUNT_ACTIVATION,
      {
        expiresIn: "10m",
      }
    );

    const msg = {
      to: email,
      from: keys.ADMIN_EMAIL,
      subject: `Account Activation Link`,
      html: `
      <h4>Please use the following link to activate your account:</h4>
      <p>${keys.CLIENT_URL}/auth/account/activate/${token}</p>      
      <hr />
      <p>This email may contain sensitive information</p>
      `,
    };

    await sendMail(msg);
    res.json({
      message: `Email has been sent to ${email}. Follow the instructions to activate your account`,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.signup = (req, res) => {
  const { token } = req.body;

  if (token) {
    jwt.verify(token, keys.JWT_ACCOUNT_ACTIVATION, async (error, decoded) => {
      if (error)
        return res.status(401).json({ error: "Expired link. Sign up again" });

      console.log("decoded", jwt.decoded);
      try {
        const { name, email, password } = jwt.decode(token);
        const username = shortId.generate();
        const profile = `${keys.CLIENT_URL}/profile/${username}`;

        const user = new User({ name, email, password, profile, username });
        await user.save();
        res.json({ message: "Signup success! Please sign in" });
      } catch (error) {
        console.log(error);
      }
    });
  }
};

exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid email" });

    if (!user.authenticate(password)) {
      return res.status(400).json({ error: "Invalid password" });
    }

    const token = jwt.sign({ _id: user._id }, keys.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", token, { expiresIn: "1d" });

    const { _id, name, username, role } = user;
    res.json({ token, user: { _id, name, username, email, role } });
  } catch (error) {
    console.log(error);
  }
};

exports.requireSignin = expressJwt({
  secret: keys.JWT_SECRET,
  algorithms: ["HS256"], // added later
  userProperty: "auth",
});

exports.authMiddleware = async (req, res, next) => {
  try {
    const authUserId = req.auth._id;
    const user = await User.findById(authUserId);
    if (!user) return res.status(400).json({ error: "User not found" });

    req.profile = user;
    next();
  } catch (error) {
    console.log(error);
  }
};

exports.adminMiddleware = async (req, res, next) => {
  console.log("admin middleware");
  try {
    const adminUserId = req.auth._id;
    const user = await User.findById(adminUserId);
    if (!user) return res.status(400).json({ error: "Admin user not found" });

    if (user.role !== 1)
      return res.status(400).json({ error: "Admin resource. Access denied" });

    req.profile = user;
    next();
  } catch (error) {
    console.log(error);
  }
};

exports.signout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Signout successfully" });
};

exports.canUpdateDeleteBlog = async (req, res, next) => {
  try {
    const slug = req.params.slug.toLowerCase();
    const blog = await Blog.findOne({ slug });

    const authorizedUser =
      blog.postedBy._id.toString() === req.profile._id.toString();

    if (!authorizedUser) {
      res.status(400);
      next({ error: "You are not authorized" });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user)
      return res.status(400).json({ error: "User with email does not exist" });

    const token = jwt.sign({ _id: user._id }, keys.JWT_SECRET, {
      expiresIn: "10m",
    });

    const msg = {
      to: email,
      from: keys.ADMIN_EMAIL,
      subject: `Reset Password Link - ${keys.APP_NAME}`,
      html: `
      <h4>Please use the following link to reset your password:</h4>
      <p>${keys.CLIENT_URL}/auth/password/reset/${token}</p>      
      <hr />
      <p>This email may contain sensitive information</p>
      `,
    };

    await user.updateOne({ resetPasswordLink: token });
    await sendMail(msg);

    res.json({
      message: `Email has been sent to ${email}. Follow the instructions to reset your password`,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.resetPassword = (req, res) => {
  const { resetPasswordLink, newPassword } = req.body;

  if (resetPasswordLink) {
    jwt.verify(resetPasswordLink, keys.JWT_SECRET, async function (
      error,
      decoded
    ) {
      if (error)
        return res.status(401).json({ error: "Expired link. Try again" });

      try {
        const user = await User.findOne({ resetPasswordLink });

        if (!user)
          return res
            .status(401)
            .json({ error: "Something went wrong. Try again" });

        const updatedFields = {
          password: newPassword,
          resetPasswordLink: "",
        };

        const updatedUser = _.extend(user, updatedFields);
        await updatedUser.save();

        res.json({ message: "Password has been reset." });
      } catch (error) {
        console.log(error);
      }
    });
  }
};

const client = new OAuth2Client(keys.GOOGLE_CLIENT_ID);
exports.googleLogin = async (req, res) => {
  try {
    const idToken = req.body.tokenId;
    const response = await client.verifyIdToken({
      idToken,
      audience: keys.GOOGLE_CLIENT_ID,
    });
    const { email_verified } = response.payload;

    if (email_verified) {
      const { name, email, jti } = response.payload;
      let userInDb = await User.findOne({ email });

      if (!userInDb) {
        const username = shortId.generate();
        const profile = `${keys.CLIENT_URL}/profile/${username}`;
        const password = jti + keys.JWT_SECRET;

        // create new user
        userInDb = new User({ name, email, password, profile, username });
        await userInDb.save();
      }

      const token = jwt.sign({ _id: userInDb._id }, keys.JWT_SECRET, {
        expiresIn: "1d",
      });

      res.cookie("token", token, { expiresIn: "1d" });

      const { _id, role, username } = userInDb;
      res.json({ token, user: { _id, email, name, role, username } });
    } else {
      return res.status(400).json({ error: "Google login failed. Try again" });
    }
  } catch (error) {
    console.log(error);
  }
};
