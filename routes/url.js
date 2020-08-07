// get
const getRegister = function(req, res)  {
  let templateVars = setCookieTemplateVars(req);
  res.render("register", templateVars);
};

// POST
const postRegister = function(req, res) {
  const email = req.body.email;
  const password = req.body.password;

  const userId = findUser(users, email);
  if (userId) {
    return res
      .status(409)
      .send("user already exists");
  }
 
  if (email && email !== "" && password && password !== "") {
    const id = generateRandomID();
    users[id] = {};
    users[id].id = id;
    users[id].email = email;
    users[id].password = password;

    return res
      .cookie("user_id", id)
      .redirect('/urls');
  }
  
  res.sendStatus(500);
};


// const getLogin = function (req, res) => {
//   let templateVars = setCookieTemplateVars(req);
//   res.render("login", templateVars);
// };

// app.post("/api/user/login", (req, res) => {
//   const email = req.body.email;
//   const password = req.body.password;

//   const userId = findUser(users, email);
//   if (userId && users[userId].password === password) {
//     return res
//       .cookie("user_id", userId)
//       .redirect("/urls");
//   }
//   return res
//     .status(403)
//     .send("wrong account info");
// });

// Logout
const postLogout = function(req, res) {
  res
    .clearCookie("user_id")
    .redirect("/urls");
};

/**
 * Transfer to long url
 */
// app.get("/u/:shortURL", (req, res) => {
//   const shortURL = req.params.shortURL;
//   if (urlDatabase[shortURL]) {
//     return res.redirect(urlDatabase[shortURL].longURL);
//   }
//   return res.send("URL not find");
// });

module.exports = {postLogout, getRegister, postRegister};


// /**
//  * URL Routes
//  */
// app.post("/urls/:shortURL/delete", (req, res) => {
//   if (!req.isLoggedIn) {
//     return res.redirect('/user/login');
//   }
//   const shortURL = req.params.shortURL;
//   delete urlDatabase[shortURL];
//   res.redirect(`/urls/`);
// });

// // EDIT: Long URL
// app.post("/urls/:shortURL/edit", (req, res) => {
//   if (!req.isLoggedIn) {
//     return res.redirect('/user/login');
//   }
//   const shortURL = req.params.shortURL;
//   const longURL = req.body.longURL;
//   urlDatabase[shortURL] = longURL;
//   res.redirect(`/urls/`);
// });

// app.get("/urls/new", (req, res) => {
//   if (!req.isLoggedIn) {
//     return res.redirect('/user/login');
//   }
//   let templateVars = setCookieTemplateVars(req);
//   res.render("urls_new", templateVars);
// });


// app.get("/urls/:shortURL", (req, res) => {
//   if (!req.isLoggedIn) {
//     return res.redirect('/user/login');
//   }

//   const shortURL = req.params.shortURL;

//   let templateVars = setCookieTemplateVars(req);
//   templateVars.shortURL = shortURL;
//   templateVars.longURL = urlDatabase[shortURL].longURL;

//   res.render("urls_show", templateVars);
// });

// app.get("/urls", (req, res) => {
//   // if (!req.isLoggedIn) {
//   //   return res.redirect('/user/login');
//   // }
//   let templateVars = setCookieTemplateVars(req);
//   templateVars.urls = urlDatabase;

//   res.render("urls_index", templateVars);
// });

// app.post("/urls", (req, res) => {
//   if (!req.isLoggedIn) {
//     return res.redirect('/user/login');
//   }
//   const longURL = req.body.longURL;
//   const shortURL = generateRandomString(longURL);
//   urlDatabase[shortURL] = {
//     longURL: longURL,
//     userID: req.user.id
//   };
//   res.redirect(`/urls/${shortURL}`);
// });