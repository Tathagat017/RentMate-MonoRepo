const express = require("express");
const router = express.Router();
const {
  AuthenticationHandler,
} = require("../middleware/authenticationHandler");
const {
  createChore,
  getChores,
  completeChore,
} = require("../controllers/choreController");

router.post("/add", AuthenticationHandler, createChore);
router.get("/:householdId", AuthenticationHandler, getChores);
router.patch("/:choreId/complete", AuthenticationHandler, completeChore);

module.exports = { choreRouter: router };
