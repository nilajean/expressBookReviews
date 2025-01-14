const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
    let userWithSameName = users.filter((user)=>{
      return user.username === username
    });
    if(userWithSameName.length > 0){
      return true;
    } else {
      return false;
    }
  }

const authenticatedUser = (username,password)=>{
    let validUser = users.filter((user)=>{
      return (user.username === username && user.password === password)
    });
    if(validUser.length > 0){
      return true;
    } else {
      return false;
    }
  }

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if(!username || !password) {
    res.status(404).json({message: "Username and password not found"});
  }
  if(authenticatedUser(username, password)){
    let accessToken = jwt.sign({
      data: password
    }, 'access', {expiresIn: 60 * 60});

    req.session.authorization = {// store the token in the user session
      accessToken, username
    } 
    res.status(200).send("User successfully logged in")
  } else {
    res.status(208).json({message: "Invalid Login, Check your password or username"})
  }
  
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    if(!isbn) {
      return res.status(403).send("ISBN is reqiured")
    }
    let filter_book = books[isbn];
    if(filter_book) {
      let review = req.query.review;
      let reviewer = req.session.authorization['username'];
      if(review) {
      filter_book['reviews'] [reviewer] = review;
      books[isbn] =filter_book;
    } else {
      return res.send('review is empty')
    }
    res.send(`The review for the book ${isbn} has been added`)
  }
  else{
    res.send("Unable to find user")
  }

});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn
    const username = req.session.authorization.username;
    
      // Use the filter method to create a new array of reviews excluding the one to delete
       const filter_book = filter_book.filter((review) => {
        return review.isbn !== isbn || review.username !== username;
      });
    
      res.send('Book is deleted'); // Send a response after filtering the book reviews
    
    
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
