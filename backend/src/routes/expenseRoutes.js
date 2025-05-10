const express = require("express");
const {
  AuthenticationHandler,
} = require("../middleware/authenticationHandler");
const {
  createExpense,
  getExpenses,
  getBalances,
  getSettleUpSuggestions,
} = require("../controllers/expenseController");

const router = express.Router();

router.post("/", AuthenticationHandler, createExpense);
router.get("/:householdId", AuthenticationHandler, getExpenses);
router.get("/:householdId/balances", AuthenticationHandler, getBalances);
router.get(
  "/:householdId/settle-up",
  AuthenticationHandler,
  getSettleUpSuggestions
);

module.exports = { expenseRouter: router };
