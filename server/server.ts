import express, { Application } from "express";
import * as fs from "fs";
import * as https from "https";
import { readAllLessons } from "./read-all-lessons.route";
import { userInfo } from "os";
// this fetches the public keys from the auth0 endpoint (advantage of not stopping the server to reload a new public key)
const jwksRsa = require("jwks-rsa");
// this configures the jwt from auth0
const jwt = require("express-jwt");

const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());

const commandLineArgs = require("command-line-args");

const optionDefinitions = [
  { name: "secure", type: Boolean, defaultOption: true },
];

const options = commandLineArgs(optionDefinitions);
const checkIfAuthenticated = jwt({
  cache: true,
  cacheMaxEntries: 10,
  rateLimit: true,
  secret: jwksRsa.expressJwtSecret({
    jwksUri: "https://dev-4nqzq5kq.us.auth0.com/.well-known/jwks.json",
  }),
  algorithms: ["RS256"],
});
app.use(checkIfAuthenticated);

app.use((err, req, res, next) => {
  if (err && err.name == "UnauthorizedError") {
    res.status(err.status).json({ message: err.message });
  } else {
    next();
  }
});
// REST API
app.route("/api/userinfo").get(userInfo);

app.route("/api/lessons").get(readAllLessons);

if (options.secure) {
  const httpsServer = https.createServer(
    {
      key: fs.readFileSync("key.pem"),
      cert: fs.readFileSync("cert.pem"),
    },
    app
  );

  // launch an HTTPS Server. Note: this does NOT mean that the application is secure
  httpsServer.listen(9000, () =>
    console.log(
      "HTTPS Secure Server running at https://localhost:" +
        httpsServer.address().port
    )
  );
} else {
  // launch an HTTP Server
  const httpServer = app.listen(9000, () => {
    console.log(
      "HTTP Server running at https://localhost:" + httpServer.address().port
    );
  });
}
