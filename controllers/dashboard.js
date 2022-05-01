"use strict";

// import all required modules
const logger = require("../utils/logger");
const booklistStore = require("../models/booklist-store.js");
const uuid = require("uuid");
const accounts = require("./accounts.js");
// create dashboard object
const dashboard = {
  // index method - responsible for creating and rendering the view
  index(request, response) {
    logger.info("dashboard rendering");
    const loggedInUser = accounts.getCurrentUser(request);
    if (loggedInUser) {
      const viewData = {
        title: "Booklist Dashboard",
        booklists: booklistStore.getUserBooklists(loggedInUser.id),
        fullName: loggedInUser.firstName + " " + loggedInUser.lastName,
      };
      logger.info("about to render" + viewData.booklists);
      response.render("dashboard", viewData);
    } else response.redirect("/");
  },
  deleteBooklist(request, response) {
    const booklistId = request.params.id;
    logger.debug(`Deleting Booklist ${booklistId}`);
    booklistStore.removeBooklist(booklistId);
    response.redirect("/dashboard");
  },
  addBooklist(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
    const newBookList = {
      id: uuid(),
      userId: loggedInUser.id,
      name: request.body.name,
      picture: request.files.picture,
      books: [],
    };
    logger.debug("Creating a new Booklist" + newBookList);
    booklistStore.addBooklist(newBookList, function () {
      response.redirect("/dashboard");
    });
  },
};

// export the dashboard module
module.exports = dashboard;
