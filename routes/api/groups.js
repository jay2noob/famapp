const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");

const Group = require("../../models/Group");
const Profile = require("../../models/Profile");
const User = require("../../models/User");

// @route   POST api/posts
// @desc    Create a post
// @access  Private
router.post(
  "/",
  [auth, [check("text", "Text is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select("-password");

      const newGroup = new Group({
        name: req.body.name,
        admin: req.user.id,
        // avatar: user.avatar,
        members: req.body.members,
      });

      const group = await newGroup.save();

      res.json(group);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route    GET api/posts
// @desc     Get all posts
// @access   Private
router.get("/", auth, async (req, res) => {
  try {
    const groups = await Group.find().sort({ date: -1 });
    res.json(groups);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route    GET api/posts/:id
// @desc     Get post by ID
// @access   Private
router.get("/:id", auth, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    // Check for ObjectId format and post
    if (!group) {
      return res.status(404).json({ msg: "Group not found" });
    }
    res.json(group);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Group not found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route    DELETE api/posts/:id
// @desc     Delete a post
// @access   Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) {
      return res.status(404).json({ msg: "Group not found" });
    }
    // Check user
    if (group.admin.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Only Admin can delete a group" });
    }
    await group.remove();
    res.json({ msg: "Group removed" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Group not found" });
    }
    res.status(500).send("Server Error");
  }
});


module.exports = router;
