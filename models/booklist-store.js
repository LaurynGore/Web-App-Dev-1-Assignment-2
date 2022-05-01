"use strict";

const _ = require("lodash");
const JsonStore = require("./json-store");

const cloudinary = require("cloudinary");
const logger = require("../utils/logger");

try {
  const env = require("../.data/.env.json");
  cloudinary.config(env.cloudinary);
} catch (e) {
  logger.info("You must provide a Cloudinary credentials file - see README.md");
  process.exit(1);
}

const booklistStore = {
  store: new JsonStore("./models/booklist-store.json", { booklistCollection: [] }),
  collection: "booklistCollection",

  getAllBooklists() {
    return this.store.findAll(this.collection);
  },

  getBooklist(id) {
    return this.store.findOneBy(this.collection, { id: id });
  },

  addBooklist(booklist, response) {
    booklist.picture.mv("tempimage", (err) => {
      if (!err) {
        cloudinary.uploader.upload("tempimage", (result) => {
          console.log(result);
          booklist.picture = result.url;
          response();
        });
      }
    });
    this.store.add(this.collection, booklist);
  },

  removeBooklist(id) {
    const booklist = this.getBooklist(id);
    this.store.remove(this.collection, booklist);
  },

  // add the book with id bookId from the booklist
  addBook(id, book, response) {
    book.picture.mv("tempimage", (err) => {
      if (!err) {
        cloudinary.uploader.upload("tempimage", (result) => {
          console.log(result);
          book.picture = result.url;
          response();
        });
      }
    });

    const booklist = this.getBooklist(id);
    booklist.books.push(book);
  },

  editBook(id, bookId, updatedBook) {
    const booklist = this.getBooklist(id);
    console.log(booklist);
    const books = booklist.books;
    const index = books.findIndex((book) => book.id === bookId);
    books[index].title = updatedBook.title;
  },

  // remove the book with id bookId from the booklist
  removeBook(id, bookId) {
    const booklist = this.getBooklist(id);
    const books = booklist.books;
    _.remove(books, { id: bookId });
  },

  getUserBooklists(userId) {
    return this.store.findBy(this.collection, { userId: userId });
  },
};

module.exports = booklistStore;
