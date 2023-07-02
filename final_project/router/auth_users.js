const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
  if (username.length < 4) return false; // The username must be at least 6 characters long.
  if (/\s/.test(username)) return false; // Username must not contain blanks.
  if (!/^[a-zA-Z0-9_]+$/.test(username)) return false; // Username must not contain special characters except underscore (_).

  return true;
}


const authenticatedUser = (username, password) => { //returns boolean
  for (let key of users) {
    if (key.username === username && key.password === password) return true;
  }
  return false;

}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) return res.status(404).json({ message: "Error logging in" });
  if (!isValid(username)) return res.status(404).json({ message: "The username is invalid!" });
  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;
  const username = req.session.authorization.username;

  if (isbn) {
    if (!books[isbn].reviews) {
      books[isbn].reviews = {};
    }

    books[isbn].reviews[username] = review;
    return res.send(books[isbn]);
  } else {
    return res.status(404).json({ message: "ISBN Invalid!" });
  }
});


regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const sessionUsername = req.session.authorization.username;

  if (!isbn) return res.status(404).json({ message: "ISBN Invalid!" });

  if (books[isbn].reviews[sessionUsername]) {
    delete books[isbn].reviews[sessionUsername];
    return res.send(books[isbn]);
  }

  return res.status(404).json({ message: "Unable to delete review" });

});



module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
