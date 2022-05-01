"use strict";

// import express and initialise router
const express = require("express");
const router = express.Router();

// import controllers
const start = require("./controllers/start.js");
const dashboard = require("./controllers/dashboard.js");
const about = require("./controllers/about.js");
const details = require("./controllers/details.js");
const accounts = require("./controllers/accounts.js");
// connect routes to controllers
router.get("/start", start.index);
router.get("/dashboard", dashboard.index);
router.get("/about", about.index);
router.get("/details/:id", details.index);
router.get("/details/:id/deleteBook/:bookId", details.deleteBook);
router.get("/dashboard/deletebooklist/:id", dashboard.deleteBooklist);
router.get("/", accounts.index);
router.get("/login", accounts.login);
router.get("/signup", accounts.signup);
router.get("/logout", accounts.logout);

router.post("/booklist/:id/addBook", details.addBook);
router.post("/dashboard/addBooklist", dashboard.addBooklist);
router.post("/details/:id/updatebook/:bookId", details.updateBook);
router.post("/register", accounts.register);
router.post("/authenticate", accounts.authenticate);

// export router module
module.exports = router;
