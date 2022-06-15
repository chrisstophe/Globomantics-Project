const passport = require("passport");
const { Strategy } = require("passport-local");
const { MongoClient, ObjectId } = require("mongodb");
const dotenv = require("dotenv").config();
const debug = require("debug")("app:localStrategy");

module.exports = function localStrategy() {
  passport.use(
    new Strategy(
      {
        usernameField: "username",
        passwordField: "password",
      },
      (username, password, done) => {
        // Connect to MongoDB
        const url = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@globomantics.e8xqilo.mongodb.net/?retryWrites=true&w=majority`;
        const dbName = "globomantics";

        (async function validateUser() {
          let client;
          try {
            // Connecting to the database at the url provided
            client = await MongoClient.connect(url);
            debug("Connected to the mongo DB");

            // Creating an instance of the mongoDB database
            const db = client.db(dbName);

            // Query the DB for the user with the passed in username
            const user = await db.collection("users").findOne({ username });

            // Check if user exists and password matches
            if (user && user.password === password) {
              // Send the user back if so
              done(null, user);
            } else {
              done(null, false);
            }
          } catch (error) {
            done(error, false);
          }
          client.close();
        })();
      }
    )
  );
};
