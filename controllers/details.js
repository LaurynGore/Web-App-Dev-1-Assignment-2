"use strict";

// import all required modules
const logger = require("../utils/logger");
const booklistStore = require("../models/booklist-store.js");
const uuid = require("uuid");
const accounts = require("./accounts.js");
// create details object
const details = {
  // index method - responsible for creating and rendering the view
  index(request, response) {
    const booklistId = request.params.id;
    // display confirmation message in log
    logger.info("details rendering");

    // create view data object (contains data to be sent to the view e.g. page title)
    const loggedInUser = accounts.getCurrentUser(request);
    if (loggedInUser) {
      const viewData = {
        title: "Booklist App Details",
        booklist: booklistStore.getBooklist(booklistId),
      };
      logger.info("about to render" + viewData.booklist);
      response.render("details", viewData);
    } else response.redirect("/");
  },
  deleteBook(request, response) {
    const booklistId = request.params.id;
    const bookId = request.params.bookId;
    logger.debug(`Deleting Book ${bookId} from Booklist ${booklistId}`);
    booklistStore.removeBook(booklistId, bookId);
    response.redirect("/details/" + booklistId);
  },

  addBook(request, response) {
    const booklistId = request.params.id;
    const newBook = {
      id: uuid(),
      title: request.body.title,
      picture: request.files.picture,
    };
    logger.debug("Creating a new book: " + newBook);
    booklistStore.addBook(booklistId, newBook, function () {
      response.redirect("/details/" + booklistId);
    });
  },

  updateBook(request, response) {
    const booklistId = request.params.id;
    const bookId = request.params.bookId;
    logger.debug("updating book " + bookId);
    const updatedBook = {
      title: request.body.title,
    };
    booklistStore.editBook(booklistId, bookId, updatedBook);
    response.redirect("/details/" + booklistId);
  },
};

// export the details module
module.exports = details;
