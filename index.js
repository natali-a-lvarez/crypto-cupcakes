require("dotenv").config(".env");
const cors = require("cors");
const express = require("express");
const app = express();
const morgan = require("morgan");
const { PORT = 3000 } = process.env;
const { auth } = require("express-openid-connect");

// TODO - require express-openid-connect and destructure auth from it

const { User, Cupcake } = require("./db");

// middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// auth router attaches /login, /logout, and /callback routes to the baseURL

/* *********** YOUR CODE HERE *********** */
// follow the module instructions: destructure config environment variables from process.env
// follow the docs:
// define the config object
// attach Auth0 OIDC auth router
// create a GET / route handler that sends back Logged in or Logged out

const { AUTH0_SECRET, AUTH0_AUDIENCE, AUTH0_CLIENT_ID, AUTH0_BASE_URL } =
  process.env;

const config = {
  authRequired: true,
  auth0Logout: true,
  secret: AUTH0_SECRET,
  baseURL: AUTH0_AUDIENCE,
  clientID: AUTH0_CLIENT_ID,
  issuerBaseURL: AUTH0_BASE_URL,
};

app.use(auth(config));

app.get("/", async (req, res, next) => {
  try {
    if (req.oidc.isAuthenticated()) {
      const user = req.oidc.user;
      const hello = `
      <h1>My Web App, Inc.</h1>
      <h2>Hello ${user.given_name}!</h2>
      <h3>Username: ${user.name}</h3>
      <p>${user.email}</p>
      <img alt=${user.name} src=${user.picture} />
      `;
      res.send(hello);
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// error handling middleware
app.use((error, req, res, next) => {
  console.error("SERVER ERROR: ", error);
  if (res.statusCode < 400) res.status(500);
  res.send({ error: error.message, name: error.name, message: error.message });
});

app.listen(PORT, () => {
  console.log(`Cupcakes are ready at http://localhost:${PORT}`);
});
