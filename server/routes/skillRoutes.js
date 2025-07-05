const express = require("express");
const router = express.Router();
const skillController = require("../controllers/skillController");
const auth = require("../middleware/auth");



router.post("/request-approval",auth,skillController.requestSkillApproval);

router.get("/approve/:token",skillController.approvalSkill)

module.exports = router;