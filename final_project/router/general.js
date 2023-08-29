const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;


  if (username && password) {
    if (!doesExist(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  } 
  return res.status(404).json({message: "Unable to register user."})
  
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
res.send(books[isbn])
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let auth = []
  for(const [key, values] of Object.entries(books)){
      const book = Object.entries(values);
      for(let i = 0; i < book.length ; i++){
          if(book[i][0] == 'author' && book[i][1] == req.params.author){
              auth.push(books[key]);
          }
      }
  }
  if(auth.length == 0){
      return res.status(300).json({message: "Author not found"});
  }
  res.send(auth);
  
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let ttle = []
  for(const [key, values] of Object.entries(books)){
      const book = Object.entries(values);
      for(let i = 0; i < book.length ; i++){
          if(book[i][0] == 'title' && book[i][1] == req.params.title){
              ttle.push(books[key]);
          }
      }
  }
  if(ttle.length == 0){
      return res.status(300).json({message: "Title not found"});
  }
  res.send(ttle);
  
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const ISBN = req.params.isbn;
  res.send(books[ISBN].reviews)
  
});
//task 1o
function getbooks(){
    return new Promise((resolve,reject)=>{
    resolve(books);
    })
    }
    public_users.get('/',function (req, res) {
      getbook().then(
        (bk)=>res.send(JSON.stringify(bk, null, 4)),
        (error) => res.send("denied")
      );  
    });
    
    
//task 11
function getFromISBN(isbn){
    let book_i = books[isbn];  
    return new Promise((resolve,reject)=>{
      if (book_i) {
        resolve(book_i);
      }else{
        reject("Unable to find book!");
      }    
    })
  }
  public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    getFromISBN(isbn).then(
      (bk)=>res.send(JSON.stringify(bk, null, 4)),
      (error) => res.send(error)
    )
   });
  //task 12
  function getFromAuthor(author){
    let op = [];
    return new Promise((resolve,reject)=>{
      for (var isbn in books) {
        let book_i = books[isbn];
        if (book_.author === author){
          op.push(book_i);
        }
      }
      resolve(op);  
    })
  }
  public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    getFromAuthor(author)
    .then(
      result =>res.send(JSON.stringify(result, null, 4))
    );
  });
  //task 13
  function getFromTitle(title){
    let op = [];
    return new Promise((resolve,reject)=>{
      for (var isbn in books) {
        let book_i = books[isbn];
        if (book_i.title === title){
          op.push(book_i);
        }
      }
      resolve(op);  
    })
  }
  public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    getFromTitle(title)
    .then(
      result =>res.send(JSON.stringify(result, null, 4))
    );
  });
module.exports.general = public_users;
