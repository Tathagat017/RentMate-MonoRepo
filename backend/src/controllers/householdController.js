const asyncHandler = require("express-async-handler");
const Household = require("../models/houseHoldModel");
const User = require("../models/userModel");
const { sendInviteEmail } = require("../utility/emailSender");
// @desc    Create a household (user becomes owner)
const createHousehold = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const household = await Household.create({
    name,
    owner: req.user._id,
  });

  // Update user's role
  await User.findByIdAndUpdate(req.user._id, {
    $push: {
      households: {
        householdId: household._id,
        role: "owner",
      },
    },
  });

  res.status(201).json(household);
});

// @desc    Join a household (user becomes member)
const joinHousehold = asyncHandler(async (req, res) => {
  const { inviteCode } = req.body;

  const household = await Household.findOne({ inviteCode });
  if (!household) {
    res.status(404);
    throw new Error("Household not found");
  }

  // Check if already a member
  const isMember = req.user.households.some((h) =>
    h.householdId.equals(household._id)
  );
  if (isMember) {
    res.status(400);
    throw new Error("Already a member");
  }

  // Add to members array
  await Household.findByIdAndUpdate(household._id, {
    $addToSet: { members: req.user._id },
  });

  // Update user's households
  await User.findByIdAndUpdate(req.user._id, {
    $push: {
      households: {
        householdId: household._id,
        role: "member",
      },
    },
  });

  res.json({ success: true });
});

// @desc    Send invite email
const sendInvite = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const household = await Household.findById(req.params.householdId);

  if (!household.owner.equals(req.user._id)) {
    res.status(403);
    throw new Error("Only the owner can send invites");
  }

  await sendInviteEmail(email, household.inviteCode, household.name);
  res.json({ success: true });
});

const removeMember = asyncHandler(async (req, res) => {
  const { householdId, userId } = req.params;

  // 1. Verify requester is owner
  const household = await Household.findById(householdId);
  if (!household.owner.equals(req.user._id)) {
    res.status(403);
    throw new Error("Only the owner can remove members");
  }

  // 2. Prevent owner from removing themselves
  if (userId === req.user._id.toString()) {
    res.status(400);
    throw new Error("Owners cannot remove themselves");
  }

  // 3. Update Household (remove from members array)
  await Household.findByIdAndUpdate(householdId, {
    $pull: { members: userId },
  });

  // 4. Update User (remove household reference)
  await User.findByIdAndUpdate(userId, {
    $pull: { households: { householdId } },
  });

  res.json({ success: true });
});

module.exports = { createHousehold, joinHousehold, sendInvite, removeMember };
