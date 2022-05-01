"use strict";

// import all required modules
const logger = require("../utils/logger");
const booklistStore = require("../models/booklist-store.js");
const accounts = require("./accounts.js");
const userStore = require("../models/user-store");
// create start object
const start = {
  // index method - responsible for creating and rendering the view
  index(request, response) {
    logger.info("start rendering");
    const loggedInUser = accounts.getCurrentUser(request);

    // Global Statistics
    const booklists = booklistStore.getAllBooklists();
    const users = userStore.getAllUsers();

    let statAllTotalBooklists = booklists.length;
    let statAllTotalBooks = getStatTotalBooks(booklists);
    let statAllAvgBooks = statAllTotalBooks / users.length;
    let statAllUserWithMost = getStatUserMost(users);
    let statAllUserWithLeast = getStatUserLeast(users);

    if (loggedInUser) {
      // User Statistics
      let userBooklists = booklistStore.getUserBooklists(loggedInUser.id);
      let statUserTotalBooklists = userBooklists.length;
      let statUserTotalBooks = getStatTotalBooks(userBooklists);
      let statUserAvgBooks = statUserTotalBooks / statUserTotalBooklists;
      let statUserListWithMost = getStatListMost(userBooklists);
      let statUserListWithLeast = getStatListLeast(userBooklists);

      const viewData = {
        title: "Welcome to the Booklist App!",
        statAllTotalBooklists: statAllTotalBooklists,
        statAllTotalBooks: statAllTotalBooks,
        statAllAvgBooksPerUser: statAllAvgBooks,
        statAllUserWithMost: statAllUserWithMost,
        statAllUserWithLeast: statAllUserWithLeast,
        statUserTotalBooklists: statUserTotalBooklists,
        statUserTotalBooks: statUserTotalBooks,
        statUserAvgBooksPerList: statUserAvgBooks,
        statUserListWithMost: statUserListWithMost,
        statUserListWithLeast: statUserListWithLeast,
        loggedIn: true,
        fullName: loggedInUser.firstName + " " + loggedInUser.lastName,
      };
      +response.render("start", viewData);
    } else response.redirect("/");
  },
};

function getStatTotalBooks(booklists) {
  let numBooks = 0;
  for (let item of booklists) {
    numBooks += item.books.length;
  }
  return numBooks;
}

function getStatUserMost(users) {
  let numMostLists = 0;
  let nameMostLists = "None";

  for (let userNum in users) {
    let user = users[userNum];
    let numUserLists = booklistStore.getUserBooklists(user.id).length;
    if (numUserLists > numMostLists) {
      numMostLists = numUserLists;
      nameMostLists = user.firstName;
    }
  }
  return nameMostLists;
}

function getStatListMost(booklists) {
  let numMostBooks = 0;
  let listName = "None";

  for (let listNum in booklists) {
    let booklist = booklists[listNum];
    let size = booklist.books.length;

    if (size > numMostBooks) {
      numMostBooks = size;
      listName = booklist.name;
    }
  }

  return listName;
}
function getStatUserLeast(users) {
  let numLeastLists = -1;
  let nameLeastLists = "None";

  for (let userNum in users) {
    let user = users[userNum];
    let numUserLists = booklistStore.getUserBooklists(user.id).length;
    if (numUserLists < numLeastLists || numLeastLists == -1) {
      numLeastLists = numUserLists;
      nameLeastLists = user.firstName;
    }
  }
  return nameLeastLists;
}
function getStatListLeast(booklists) {
  let numLeastBooks = -1;
  let listName = "None";

  for (let listNum in booklists) {
    let booklist = booklists[listNum];
    let size = booklist.books.length;

    if (size < numLeastBooks || numLeastBooks == -1) {
      numLeastBooks = size;
      listName = booklist.name;
    }
  }

  return listName;
}
// export the start moduleS
module.exports = start;
