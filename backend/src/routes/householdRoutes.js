const express = require("express");
const {
  createHousehold,
  joinHousehold,
  sendInvite,
  removeMember,
} = require("../controllers/householdController");
const {
  AuthenticationHandler,
} = require("../middleware/authenticationHandler");

const router = express.Router();

router.post("/", AuthenticationHandler, createHousehold);
router.post("/join", AuthenticationHandler, joinHousehold);
router.post("/:householdId/invite", AuthenticationHandler, sendInvite);
router.delete(
  "/:householdId/members/:userId",
  AuthenticationHandler,
  removeMember
);
module.exports = { householdRouter: router };
