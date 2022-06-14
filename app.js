const express = require("express");
const chalk = require("chalk");
const debug = require("debug")("app");
const morgan = require("morgan");

const PORT = process.env.PORT || 3000;

// Create an instance of express
const app = express();
const sessionsRouter = express.Router();

// Middleware
app.use(morgan("tiny"));
app.use(express.static(`${__dirname}/public`));

app.set("views", `${__dirname}/src/views`);
app.set("view engine", "ejs");

// Implementing sessions
sessionsRouter.route("/").get((req, res) => {
  res.render("sessions", {
    sessions: [
      { title: "Session 1", description: "this is session 1" },
      { title: "Session 2", description: "this is session 2" },
      { title: "Session 3", description: "this is session 3" },
      { title: "Session 4", description: "this is session 4" },
    ],
  });
});

sessionsRouter.route("/1").get((req, res) => {
  res.send("hello single sessions");
});

app.use("/sessions", sessionsRouter);

// Specify the callback for requests to a specific route
app.get("/", (req, res) => {
  res.render("index", { title: "Globomantics", data: ["a", "b", "c"] });
});

// Listen on  a PORT and specify callback
app.listen(PORT, () => {
  debug(`Listening on PORT ${chalk.green(PORT)}`);
});
