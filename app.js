const express = require("express");
const chalk = require("chalk");
const debug = require("debug")("app");
const morgan = require("morgan");
const PORT = process.env.PORT || 3000;
const passport = require("passport");
const cookieParser = require("cookie-parser");
const session = require("express-session");

// Create an instance of express
const app = express();

// Requiring the different routers
const sessionsRouter = require("./src/routers/sessionsRouter");
const adminRouter = require("./src/routers/adminRouter");
const authRouter = require("./src/routers/authRouter");
const { urlencoded } = require("express");

// Middleware
app.use(morgan("tiny"));
app.use(express.static(`${__dirname}/public`));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: "globomantics" }));

require("./src/config/passport.js")(app);

app.set("views", `${__dirname}/src/views`);
app.set("view engine", "ejs");

// Using the routers as Middleware
app.use("/sessions", sessionsRouter);
app.use("/admin", adminRouter);
app.use("/auth", authRouter);

// Specify the callback for requests to a specific route
app.get("/", (req, res) => {
  res.render("index", { title: "Globomantics", data: ["a", "b", "c"] });
});

// Listen on  a PORT and specify callback
app.listen(PORT, () => {
  debug(`Listening on PORT ${chalk.green(PORT)}`);
});
