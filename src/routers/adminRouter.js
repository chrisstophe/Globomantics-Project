const express = require("express");
const debug = require("debug")("app:adminRouter");
const { MongoClient } = require("mongodb");
const sessions = require("../data/sessions.json");
const dotenv = require("dotenv").config();

const adminRouter = express.Router();

adminRouter.route("/").get((req, res) => {
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

      // Used to add many objects/documents to a mongoDB database
      // Since the inserted documents don't contain an _id field, mongoDB will generate a unique _id for each
      // and return an insertedIds array, containing _id values for each successfully inserted document
      const response = await db.collection("sessions").insertMany(sessions);

      res.json(response);
    } catch (error) {
      debug(error.stack);
    }
  })();
});

module.exports = adminRouter;
