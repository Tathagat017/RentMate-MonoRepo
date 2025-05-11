const asyncHandler = require("express-async-handler");
const Chore = require("../models/choreModel");
const Household = require("../models/houseHoldModel");

// Create a new chore
// Create a new chore
const createChore = asyncHandler(async (req, res) => {
  const { name, frequency, householdId, assignedTo, dueDate } = req.body;

  const household = await Household.findById(householdId).populate("members");
  if (!household) throw new Error("Household not found");

  const firstAssignee = assignedTo ?? household.members[0] ?? req.user;

  const now = new Date();
  const lastDate = new Date(now);

  if (frequency === "daily") {
    lastDate.setDate(now.getDate() + 1);
  } else if (frequency === "weekly") {
    lastDate.setDate(now.getDate() + 7);
  } else if (frequency === "monthly") {
    lastDate.setMonth(now.getMonth() + 1);
  }

  if (dueDate) {
    lastDate.setTime(new Date(dueDate).getTime());
  }

  const chore = await Chore.create({
    name,
    frequency,
    householdId,
    assignedTo: firstAssignee._id,
    rotationIndex: 0,
    dueDate: lastDate,
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
  const now = new Date();
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
  if (members.length === 1 || members.length === 0) {
    chore.assignedTo = req.user._id;
    chore.rotationIndex = 0;
    await chore.save();
    res.json({ success: true });
    return;
  }
  const nextIndex = (chore.rotationIndex + 1) % members.length;
  chore.assignedTo = members[nextIndex]._id ?? req.user._id;
  chore.rotationIndex = nextIndex;

  await chore.save();
  res.json({ success: true });
});

const getChoreById = asyncHandler(async (req, res) => {
  const { choreId } = req.params;
  const chore = await Chore.findById(choreId);
  res.json(chore);
});

module.exports = { createChore, getChores, completeChore, getChoreById };
