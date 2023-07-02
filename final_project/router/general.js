const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) return res.status(404).json({ message: "The username is invalid!" });

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
  const allBooks = JSON.stringify(books, null, 4);

  return new Promise((resolve, reject) => {
    resolve(res.send(allBooks));
  })
    .then(() => console.log('Promise complete'))
    .catch(e => console.log(e));;

});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  return new Promise((resolve, reject) => {
    if (isbn <= Object.keys(books).length) {
      resolve(res.send(books[isbn]));
    } else {
      return res.status(404).json({ message: "Invalid ISBN!" });
    }
  })
    .then(() => console.log('Promise complete'))
    .catch(e => console.log(e));;


});

// Get book details based on author
// "Jane Austen" = "Jane%20Austen"
public_users.get('/author/:author', function (req, res) {
  const codedAuthor = req.params.author;
  const author = decodeURIComponent(codedAuthor);

  return new Promise((resolve, reject) => {
    for (let key in books) {
      if (books[key].author == author) {
        resolve(res.send(books[key]));
      }
    }
    return res.status(404).json({ message: "Invalid author!" });
  })
    .then(() => console.log('Promise Complete'))
    .catch(e => console.log(e));


});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const codedTitle = req.params.title;
  const title = decodeURIComponent(codedTitle);

  return new Promise((resolve, reject) => {
    for (let key in books) {
      if (books[key].title == title) {
        resolve(res.send(books[key]));
      }
    }
    return res.status(404).json({ message: "Invalid title!" });
  })
    .then(() => console.log('Promise complete'))
    .catch(e => console.log(e));

});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (isbn) {
    return res.send(books[isbn].reviews);
  } else {
    return res.status(404).json({ message: "Invalid ISBN!" });
  }

});

module.exports.general = public_users;
