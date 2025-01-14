const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    // Retrieve the details from the body
    const username = req.body.username;
    const password = req.body.password;
    // Check if username are and password are provided in the body
    if(password && username) {
      //Call the isValid function to check if user already existed
      if(!isValid(username)){
        //if not existed store it in the users array
        users.push({"username": username, "password": password})
        res.status(200).json({message: "User successfully registered"})
      } else{
        return res.status(404).json({message: "User not registered"});
      }
    }
    return res.status(404).json({message: "User details not provided"});
    
  });

// Get the book list available in the shop
public_users.get('/',function (req, res) {

    res.send(JSON.stringify({books},null,4))
  });
  
  //Get the book list using promise await/async with axios
  public_users.get('/async-get-books', async function (req, res) {
    try {
      const bookList = JSON.stringify({ books }, null, 4);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return res.status(200).json({ books: bookList });
    } catch (error) {
      return res.status(404).json({ message: `Book list not found` });
    }
  });

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const isbn = req.params.isbn;
  res.send(books[isbn])
 });

  // Get book details based on ISBN using promise async and await
public_users.get('/get-books/:isbn', async (req, res) => {
    try {
      const isbn = req.params.isbn;
      const book = books[isbn];
  
      // Simulate an asynchronous delay (e.g., database query) for demonstration
      await new Promise((resolve) => setTimeout(resolve, 1000));
  
      if (book) {
        res.status(200).json(book);
      } else {
        res.status(404).send('Book not found');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal server error');
    }
  });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    // Retrieve the name from the request parameter
  let authorName = req.params.author;

  //Create an array to store the author's details
  let booksByAuthor = [];
  
  // iterate over the books database and find the book using the author name
 for(let isbn in books) {
  if(books[isbn].author === authorName) {
    let book = books[isbn]
    booksByAuthor.push(book)
  
  }
 }

  // check if the book exist
  if(booksByAuthor.length > 0){
    res.status(200).json(booksByAuthor)
  } else{
    res.status(404).send('Book with the author name not found')
  }
});

// Get all books details by author Using promise or async/await with axios (asynchronous)
public_users.get('/async-author/:author', async (req, res) => {
    try {
      const authorName = req.params.author;
      const booksByAuthor = [];
  
      // Simulate an asynchronous delay (e.g., database query) for demonstration
      await new Promise((resolve) => setTimeout(resolve, 1000));
  
      // Iterate over the books database and find books by author name
      for (let isbn in books) {
        if (books[isbn].author === authorName) {
          let book = books[isbn];
          booksByAuthor.push(book);
        }
      }
  
      // Check if books by the author exist
      if (booksByAuthor.length > 0) {
        res.status(200).json(booksByAuthor);
      } else {
        res.status(404).send('Books by the author not found');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal server error');
    }
  });

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const titleOfBook = req.params.title; // Retrieve the title from the request parameter
  
    // iterates through the book database
    const bookTitle = [];
    for(let isbn in books){
      if(books[isbn].title === titleOfBook) {
        const book = books[isbn]
        bookTitle.push(book)
      }
    }
  
    // Check if a book with the title exist in the database
    if(bookTitle.length > 0){
      res.status(200).json(bookTitle)
    } else{
      res.status(404).send('No available book with such title')
    }
   
  });

  // Get all books details by title using promise async/await and axios
public_users.get('/async-title/:title', async (req, res) => {
    try {
      const titleOfBook = req.params.title;
      const bookTitle = [];
  
      // Simulate an asynchronous delay (e.g., database query) for demonstration
      await new Promise((resolve) => setTimeout(resolve, 1000));
  
      // Iterate through the book database and find books by title
      for (let isbn in books) {
        if (books[isbn].title === titleOfBook) {
          const book = books[isbn];
          bookTitle.push(book);
        }
      }
  
      // Check if books with the title exist in the database
      if (bookTitle.length > 0) {
        res.status(200).json(bookTitle);
      } else {
        res.status(404).send('No available book with such title');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal server error');
    }
  });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const bookReview = req.params.isbn
    // store the review in the variable book
    const book = books[bookReview]
    // Check if the book with the provided isbn exist
    if(book){
     res.status(200).json(book.reviews)// Return the review of the specified book
    } else{
     res.status(404).send('No book review')
    }
   
 });   



module.exports.general = public_users;
