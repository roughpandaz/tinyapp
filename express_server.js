const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cookieSession = require('cookie-session');
const bcrypt = require('bcryptjs');

const {generateRandomString, generateRandomID} = require("./utils/id-generator");
const {findUser} = require("./utils/find-user");
const {urlDatabase, users} = require("./db");

const morgan = require('morgan');

const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(morgan('dev'));

app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2'],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));


app.use((req,res,next)=>{
  req.isLoggedIn = false;
  const userId = req.session["user_id"];
  if (userId && users[userId]) {
    req.isLoggedIn = true;
    req.user = users[userId];
  }
  next();
});

// Set user cookie object
const setCookieTemplateVars = function(req) {
  let responseObj = {};
  try {
    responseObj.userId = users[req.session["user_id"]];
    console.log("Cookie found");
  } catch (error) {
    responseObj.userId = undefined;
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

  const userId = findUser(users, email);
  if (userId) {
    return res
      .status(409)
      .send("user already exists");
  }
 
  if (email !== undefined && email !== "" && password !== undefined && password !== "") {
    const id = generateRandomID();
    users[id] = {};
    users[id].id = id;
    users[id].email = email;

    const hashedPassword = bcrypt.hashSync(password, 10);
    users[id].password = hashedPassword;

    req.session['user_id'] = id;
    return res.redirect('/urls');
  }
  
  res.sendStatus(500);
});


app.get("/user/login", (req, res) => {
  let templateVars = setCookieTemplateVars(req);
  res.render("login", templateVars);
});

app.post("/api/user/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const userId = findUser(users, email);

  if (userId && bcrypt.compareSync(password, users[userId].password)) {
    req.session['user_id'] = userId;
    return res.redirect("/urls");
  }
  return res
    .status(403)
    .send("wrong account info");
});

// Logout
app.post("/user/logout", (req, res) => {
  req.session = null;
  return res.redirect("/urls");
});

/**
 * Transfer to long url
 */
app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  if (urlDatabase[shortURL]) {
    return res.redirect(urlDatabase[shortURL].longURL);
  }
  return res.send("URL not find");
});

/**
 * URL Routes
 */
app.post("/urls/:shortURL/delete", (req, res) => {
  if (!req.isLoggedIn) {
    return res.redirect('/user/login');
  }

  const shortURL = req.params.shortURL;

  if (urlDatabase[shortURL].userID !== req.user.id && urlDatabase[shortURL].userID !== "demo987asdfakdhsf") {
    return res
      .status(409)
      .send("you don't have permission");
  }

  delete urlDatabase[shortURL];
  res.redirect(`/urls/`);
});

// EDIT: Long URL
app.post("/urls/:shortURL/edit", (req, res) => {
  if (!req.isLoggedIn) {
    return res.redirect('/user/login');
  }

  const shortURL = req.params.shortURL;
  const longURL = req.body.longURL;
  if (urlDatabase[shortURL].userID !== req.user.id && urlDatabase[shortURL].userID !== "demo987asdfakdhsf") {
    return res
      .status(409)
      .send("you don't have permission");
  }

  urlDatabase[shortURL].longURL = longURL;
  res.redirect(`/urls/`);
});

app.get("/urls/new", (req, res) => {
  if (!req.isLoggedIn) {
    return res.redirect('/user/login');
  }
  let templateVars = setCookieTemplateVars(req);
  res.render("urls_new", templateVars);
});


app.get("/urls/:shortURL", (req, res) => {
  if (!req.isLoggedIn) {
    return res.redirect('/user/login');
  }

  const shortURL = req.params.shortURL;

  let templateVars = setCookieTemplateVars(req);
  templateVars.shortURL = shortURL;
  templateVars.longURL = urlDatabase[shortURL].longURL;

  res.render("urls_show", templateVars);
});

app.get("/urls", (req, res) => {
  if (!req.isLoggedIn) {
    return res.redirect('/user/login');
  }
  let templateVars = setCookieTemplateVars(req);

  let resDatabase = {};

  for (const key in urlDatabase) {
    if (Object.hasOwnProperty.call(urlDatabase, key)) {
      if (urlDatabase[key].userID === req.user.id || urlDatabase[key].userID === "demo987asdfakdhsf") {
        resDatabase[key] = urlDatabase[key];
      }
    }
  }
  templateVars.urls = resDatabase;

  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  if (!req.isLoggedIn) {
    return res.redirect('/user/login');
  }
  const longURL = req.body.longURL;
  const shortURL = generateRandomString(longURL);
  urlDatabase[shortURL] = {
    longURL: longURL,
    userID: req.user.id
  };
  res.redirect(`/urls/${shortURL}`);
});

app.get("/", (req, res) => {
  res.redirect("urls");
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


module.exports = app;