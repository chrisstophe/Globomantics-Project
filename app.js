const express = require("express");
const chalk = require("chalk");
const debug = require("debug")("app");
const morgan = require("morgan");
const PORT = process.env.PORT || 3000;

// Create an instance of express
const app = express();
const sessionsRouter = require("./src/routers/sessionsRouter");

// Middleware
app.use(morgan("tiny"));
app.use(express.static(`${__dirname}/public`));

app.set("views", `${__dirname}/src/views`);
app.set("view engine", "ejs");

// Implementing sessions

app.use("/sessions", sessionsRouter);

// Specify the callback for requests to a specific route
app.get("/", (req, res) => {
  res.render("index", { title: "Globomantics", data: ["a", "b", "c"] });
});

// Listen on  a PORT and specify callback
app.listen(PORT, () => {
  debug(`Listening on PORT ${chalk.green(PORT)}`);
});
