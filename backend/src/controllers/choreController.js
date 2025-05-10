const asyncHandler = require("express-async-handler");
const Chore = require("../models/choreModel");
const Household = require("../models/houseHoldModel");

// Create a new chore
// Create a new chore
const createChore = asyncHandler(async (req, res) => {
  const { name, frequency, householdId } = req.body;

  const household = await Household.findById(householdId).populate("members");
  if (!household) throw new Error("Household not found");

  const firstAssignee = household.members[0];

  const now = new Date();
  const dueDate = new Date(now);

  if (frequency === "daily") {
    dueDate.setDate(now.getDate() + 1);
  } else if (frequency === "weekly") {
    dueDate.setDate(now.getDate() + 7);
  } else if (frequency === "monthly") {
    dueDate.setMonth(now.getMonth() + 1);
  }

  const chore = await Chore.create({
    name,
    frequency,
    householdId,
    assignedTo: firstAssignee._id,
    rotationIndex: 0,
    dueDate,
    isOverDue: false,
  });

  res.status(201).json(chore);
});

// Get all chores for a household
const getChores = asyncHandler(async (req, res) => {
  const { householdId } = req.params;

  const chores = await Chore.find({ householdId });

  const now = new Date();
  const updatedChores = await Promise.all(
    chores.map(async (chore) => {
      const wasOverdue = chore.isOverDue;
      const isNowOverdue = chore.dueDate < now;

      if (wasOverdue !== isNowOverdue) {
        chore.isOverDue = isNowOverdue;
        await chore.save();
      }

      return chore.populate("assignedTo", "name _id");
    })
  );

  res.json(updatedChores);
});

// Mark chore as done and rotate
const completeChore = asyncHandler(async (req, res) => {
  const { choreId } = req.params;

  const chore = await Chore.findById(choreId);
  if (!chore) throw new Error("Chore not found");

  const household = await Household.findById(chore.householdId).populate(
    "members"
  );
  const members = household.members;
  const wasMissed = chore.dueDate < now;

  // Log completion
  chore.history.push({
    user: req.user._id,
    completedAt: new Date(),
    wasMissed,
  });

  const newDueDate = new Date(chore.dueDate); // advance from previous dueDate
  if (chore.frequency === "daily") {
    newDueDate.setDate(newDueDate.getDate() + 1);
  } else if (chore.frequency === "weekly") {
    newDueDate.setDate(newDueDate.getDate() + 7);
  } else if (chore.frequency === "monthly") {
    newDueDate.setMonth(newDueDate.getMonth() + 1);
  }
  chore.dueDate = newDueDate;
  chore.isOverDue = false;
  // Rotate to next member
  const nextIndex = (chore.rotationIndex + 1) % members.length;
  chore.assignedTo = members[nextIndex]._id;
  chore.rotationIndex = nextIndex;

  await chore.save();
  res.json({ success: true });
});

module.exports = { createChore, getChores, completeChore };
