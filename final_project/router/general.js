const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  
  if (username && password) {
    for (let key of users) {
      if (key.username === username) {
        return res.status(404).json({ message: "User already exists!" });
      }
    }

    users.push({ "username": username, "password": password });
    return res.status(200).json({ message: "User successfully registred. Now you can login" });
  }

  return res.status(404).json({ message: "Unable to register user." });


});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  const allBooks = JSON.stringify(books);
  res.send(allBooks);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  if (isbn <= Object.keys(books).length) {
    return res.send(books[isbn]);
  } else {
    return res.status(404).json({ message: "ISBN Invalid!" });
  }

});

// Get book details based on author
// "Jane Austen" = "Jane%20Austen"
public_users.get('/author/:author', function (req, res) {
  const codedAuthor = req.params.author;
  const author = decodeURIComponent(codedAuthor);

  for (let key in books) {
    if (books[key].author == author) {
      return res.send(books[key]);
    }
  }

});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const codedTitle = req.params.title;
  const title = decodeURIComponent(codedTitle);

  for (let key in books) {
    if (books[key].title == title) {
      return res.send(books[key]);
    }
  }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (isbn) {
    return res.send(books[isbn].reviews);
  } else {
    return res.status(404).json({ message: "ISBN Invalid!" });
  }


});

module.exports.general = public_users;
