const withCSS = require("@zeit/next-css");

module.exports = withCSS({
  publicRuntimeConfig: {
    APP_NAME: "SEOBLOG",
    API_DEVELOPMENT: "http://localhost:5000/api",
    PRODUCTION: false,
    DOMAIN_DEVELOPMENT: "http://localhost:3000",
    DOMAN_PRODUCTION: "",
    FB_APP_ID: "326626271786396",
    DISQUS_SHORTNAME: "blog-j4kipqrcet",
  },
});
