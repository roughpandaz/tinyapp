const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const {generateRandomString, generateRandomID} = require("./utils/id-generator");

const morgan = require('morgan');

const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(morgan('dev'));

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  }
};

app.post("/login", (req, res) => {
  res
    .cookie("username", req.body.username)
    .redirect("/urls");
});

app.post("/logout", (req, res) => {
  res
    .clearCookie("username")
    .redirect("/urls");
});


const setCookieTemplateVars = function(req) {
  let responseObj = {};
  try {
    responseObj.username = req.cookies["username"];
  } catch (error) {
    responseObj.username = undefined;
    console.log("cannot find cookie");
  }

  return responseObj;
};



/**
 * User Routes
 */
app.get("/user/register", (req, res) => {
  let templateVars = setCookieTemplateVars(req);
  res.render("register", templateVars);
});

app.post("/api/user/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  for (const key in users) {
    if (users.hasOwnProperty(key)) {
      console.log(email === users[key].email, users[key].email, email);
      if (users[key].email === email) {
        return res
          .status(409)
          .send("user already exists");
      }
    }
  }

  if (email && email !== "" && password && password !== "") {
    const id = generateRandomID();
    users[id] = {};
    users[id].id = id;
    users[id].email = email;
    users[id].password = password;
    return res.redirect('/urls');
  }
  
  res.sendStatus(500);
});


/**
 * URL Routes
 */


app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect(`/urls/`);
});

// EDIT: Long URL
app.post("/urls/:shortURL/edit", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = longURL;
  res.redirect(`/urls/`);
});

app.post("/urls", (req, res) => {
  const longURL = req.body.longURL;
  const shortURL = generateRandomString(longURL);
  urlDatabase[shortURL] = longURL;
  res.redirect(`/urls/${shortURL}`);
});

app.get("/urls/new", (req, res) => {
  let templateVars = setCookieTemplateVars(req);
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  let templateVars = { shortURL, longURL: urlDatabase[shortURL]};

  
  try {
    templateVars.username = req.cookies["username"];
  } catch (error) {
    templateVars.username = undefined;
    console.log("cannot find cookie");
  }
  
  res.render("urls_show", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  let templateVars = { shortURL, longURL: urlDatabase[shortURL] };
  try {
    templateVars.username = req.cookies["username"];
  } catch (error) {
    console.log("cannot find cookie");
  }
  
  res.render("urls_show", templateVars);
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase};

  try {
    templateVars.username = req.cookies["username"];
  } catch (error) {
    templateVars.username = undefined;
    console.log("cannot find cookie");
  }

  res.render("urls_index", templateVars);
});

app.get("/", (req, res) => {
  res.redirect("urls");
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


module.exports = app;