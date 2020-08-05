const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const crypto = require('crypto');
const morgan = require('morgan');

const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(morgan('combined'));

app.use((req, res, next)=>{
  console.log("WHERE", req.cookies);
  next();
});

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const generateRandomString = function(input) {
  const secret = 'abcdefg';
  const hash = crypto.createHmac('sha256', secret)
    .update(input)
    .digest('hex');
  // return only first 6 charactors of the hash
  return hash.split("").splice(0,6).join("");
};

app.post("/login", (req, res) => {
  res
    .cookie("username", req.body.username)
    .send("/urls");
});

app.post("/logout", (req, res) => {
  res
    .clearCookie("username")
    .redirect("/urls");
});

/**
 *
 */
app.post("/urls", (req, res) => {
  const longURL = req.body.longURL;
  const shortURL = generateRandomString(longURL);
  urlDatabase[shortURL] = longURL;
  res.redirect(`/urls/${shortURL}`);
});

app.get("/urls/new", (req, res) => {
  let templateVars;
  try {
    templateVars.username = req.cookies["username"];
  } catch (error) {
    templateVars.username = undefined;
    console.log("cannot find cookie");
  }
  try {
    templateVars.username = req.cookies["username"];
  } catch (error) {
    templateVars.username = undefined;
    console.log("cannot find cookie");
  }
  res.render("urls_new", templateVars);
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase};

  try {
    templateVars.username = req.cookies["username"];
    console.log("TESTING:", req.cookies["username"]);
  } catch (error) {
    console.log("NONE");
    templateVars.username = undefined;
    console.log("cannot find cookie");
  }

  res.render("urls_index", templateVars);
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


app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect(`/urls/`);
});

/**
 * EDIT: Long URL
 */
app.post("/urls/:shortURL/edit", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = req.body.longURL;
  console.log(longURL);
  urlDatabase[shortURL] = longURL;
  res.redirect(`/urls/`);
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});