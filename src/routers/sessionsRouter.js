const express = require("express");
const debug = require("debug")("app:sessionRouter");
const { MongoClient, ObjectId } = require("mongodb");
// const sessions = require("../data/sessions.json");
const dotenv = require("dotenv").config();

const sessionsRouter = express.Router();

sessionsRouter.route("/").get((req, res) => {
  const url = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@globomantics.e8xqilo.mongodb.net/?retryWrites=true&w=majority`;
  const dbName = "globomantics";

  (async function mongo() {
    let client;
    try {
      // Connecting to the database at the url provided
      client = await MongoClient.connect(url);
      debug("Connected to the mongo DB");

      // Creating an instance of the mongoDB database
      const db = client.db(dbName);

      // Here, load all the data from sessions from the mongoDB database instead of from the json file
      const sessions = await db.collection("sessions").find().toArray();
      res.render("sessions", { sessions });
    } catch (error) {
      debug(error.stack);
    }
    client.close();
  })();
});

sessionsRouter.route("/:id").get((req, res) => {
  const id = req.params.id;
  const url =
    "mongodb+srv://dbUser:ERPtuSLGren3BCxZ@globomantics.e8xqilo.mongodb.net/?retryWrites=true&w=majority";
  const dbName = "globomantics";

  (async function mongo() {
    let client;
    try {
      // Connecting to the database at the url provided
      client = await MongoClient.connect(url);
      debug("Connected to the mongo DB");

      // Creating an instance of the mongoDB database
      const db = client.db(dbName);

      // Find a particular session by id from the mongoDB database instead of from the json file
      const session = await db
        .collection("sessions")
        .findOne({ _id: new ObjectId(id) });

      res.render("session", { session });
    } catch (error) {
      debug(error.stack);
    }
    client.close();
  })();
});

module.exports = sessionsRouter;
