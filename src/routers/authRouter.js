const express = require("express");
const debug = require("debug")("app:sessionRouter");
const { MongoClient, ObjectId } = require("mongodb");
const dotenv = require("dotenv").config();

const authRouter = express.Router();
authRouter.route("/signup").post((req, res) => {
  //Creating the user
  const { username, password } = req.body;

  // Connect to MongoDB and add the user
  const url = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@globomantics.e8xqilo.mongodb.net/?retryWrites=true&w=majority`;
  const dbName = "globomantics";

  (async function addUser() {
    let client;
    try {
      client = await MongoClient.connect(url);
      const db = client.db(dbName);
      const user = { username, password };
      // Create the users collection and add the user
      const results = await db.collection("users").insertOne(user);
      // Extract the generated user ID
      const userID = results.insertedId;
      // Query the users collection to extract the newly created user
      const mongoDBUser = await db.collection("users").findOne({ _id: userID });

      // Redirect to profile page
      req.login(mongoDBUser, () => {
        res.redirect("/auth/profile");
      });
    } catch (err) {
      debug(err);
    }
    client.close();
  })();
});

authRouter.route("/profile").get((req, res) => {
  res.json(req.user);
});

module.exports = authRouter;
