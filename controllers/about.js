"use strict";

// import all required modules
const logger = require("../utils/logger");
const accounts = require("./accounts.js");

const about = {
  // index method - responsible for creating and rendering the view
  index(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
    logger.info("about rendering");
    if (loggedInUser) {
      const viewData = {
        title: "About the Booklist App",
        fullName: loggedInUser.firstName + " " + loggedInUser.lastName,
      };
      response.render("about", viewData);
    } else response.redirect("/");
  },
};

module.exports = about;
