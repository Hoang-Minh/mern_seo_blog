const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const keys = require("./config/keys");
const { notFound, errorHandler } = require("./helpers/error");
const blogRoutes = require("./routes/blog");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const tagRoutes = require("./routes/tag");
const formRoutes = require("./routes/form");
const PORT = process.env.PORT || 5000;

app.use(morgan("dev"));
app.use(express.json({ limit: "5mb" }));
app.use(cors());

mongoose
  .connect(keys.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log("Database connected"));

app.use("/api", authRoutes);
app.use("/api", blogRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", tagRoutes);
app.use("/api", formRoutes);

if (process.env.NODE_ENV === "production") {
  // Express will serve up production assets
  // like our main.js file or main.css file
  app.use(express.static("client/.next/server"));

  // Express will serve up the index.html file if it doesn't recognize the route
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(
      path.resolve(
        __dirname,
        "client",
        ".next",
        "server",
        "pages",
        "index.html"
      )
    );
  });
}

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
