const withCSS = require("@zeit/next-css");

module.exports = withCSS({
  publicRuntimeConfig: {
    APP_NAME: "SEOBLOG",
    API_DEVELOPMENT: "https://secure-hamlet-36410.herokuapp.com:5000/api",
    PRODUCTION: true,
    DOMAIN_DEVELOPMENT: "https://secure-hamlet-36410.herokuapp.com:3000",
    DOMAN_PRODUCTION: "",
    FB_APP_ID: "326626271786396",
    DISQUS_SHORTNAME: "blog-j4kipqrcet",
    GOOGLE_CLIENT_ID:
      "227788984004-jfl9c9m6mc259qja0vcg85v0k6r3u9dn.apps.googleusercontent.com",
    GOOGLE_CLIENT_SECRET: "f61N7JABU81F_XIwn3Eo7y_8",
  },
});
