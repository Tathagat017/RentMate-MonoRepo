const express = require("express");
const router = express.Router();
const {
  getHistory,
  exportHistoryToCSV,
} = require("../controllers/historyController");

router.get("/:householdId/history", getHistory);

router.get("/:householdId/history/export", exportHistoryToCSV);

module.exports = { historyRouter: router };
