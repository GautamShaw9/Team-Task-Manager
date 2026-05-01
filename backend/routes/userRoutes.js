const router = require("express").Router();
const User = require("../models/User");
const auth = require("../middleware/authMiddleware");

router.get("/members", auth, async (req, res) => {
  const members = await User.find({ role: "member" }).select("_id name role");
  res.json(members);
});

module.exports = router;
