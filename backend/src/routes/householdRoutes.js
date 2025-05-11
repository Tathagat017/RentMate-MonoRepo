const express = require("express");
const {
  createHousehold,
  joinHousehold,
  sendInvite,
  removeMember,
  sendBulkInvites,
  getUserHouseholds,
  getHouseHoldById,
} = require("../controllers/householdController");
const {
  AuthenticationHandler,
} = require("../middleware/authenticationHandler");

const router = express.Router();

router.get("/:householdId", getHouseHoldById);
router.post("/", AuthenticationHandler, createHousehold);
router.post("/join", AuthenticationHandler, joinHousehold);
router.post("/mine", AuthenticationHandler, getUserHouseholds);
router.post("/:householdId/invite", AuthenticationHandler, sendInvite);
router.post("/:householdId/invite/bulk", sendBulkInvites);
router.delete(
  "/:householdId/members/:userId",
  AuthenticationHandler,
  removeMember
);
module.exports = { householdRouter: router };
