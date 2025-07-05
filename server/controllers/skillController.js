const PendingSkill = require("../models/PendingSkills.model");
const Intern = require("../models/Intern");
const crypto = require("crypto");
const { sendSkillApprovalEmail } = require("../utils/sendEmail")
// Enail is pending

module.exports.requestSkillApproval = async (req, res) => {
    try {
    
        const { name, category, level } = req.body;
        const userId = req.user._id || req.user.id;
       
        const approvalToken = crypto.randomBytes(32).toString('hex');
        const pendingSkill = new PendingSkill({
            userId,
            skill: { name, category, level },
            approvalToken
        });
        await pendingSkill.save();

        const approvalLink = `${process.env.FRONTEND_URL}/approve-skill/${approvalToken}`;
        await sendSkillApprovalEmail(process.env.ADMIN_EMAIL, approvalLink, { name, category, level }, req.user);

        res.json({
            message: 'Skill submitted for admin approval'
        });
    } catch (error) {
        console.error('Error in requestSkillApproval:', error);
        res.status(500).json({ error: 'Failed to submit skill for approval', details: error.message });
    }
}

module.exports.approvalSkill = async (req, res) => {
    const { token } = req.params;
    
    try {
        const pendingSkill = await PendingSkill.findOne({
            approvalToken: token,
            approved: false
        });
        
        if (!pendingSkill) {
            // Check if skill was already approved
            const alreadyApproved = await PendingSkill.findOne({
                approvalToken: token,
                approved: true
            });
            
            if (alreadyApproved) {
                console.log('Skill was already approved');
                return res.status(200).json({
                    success: true,
                    message: 'Skill was already approved and added to user'
                });
            }
            
            return res.status(400).json({ error: 'Invalid or expired token' });
        }

        const user = await Intern.findById(pendingSkill.userId);
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Add the skill with approved: true
        const approvedSkill = {
            name: pendingSkill.skill.name,
            category: pendingSkill.skill.category,
            level: pendingSkill.skill.level,
            approved: true
        };
        
        user.skills.push(approvedSkill);
        await user.save();

        pendingSkill.approved = true;
        await pendingSkill.save();


        
        
        // Clean up the token after a delay to prevent frontend issues
        setTimeout(async () => {
            try {
                pendingSkill.approvalToken = undefined;
                await pendingSkill.save();
                console.log('Approval token cleaned up successfully');
            } catch (error) {
                console.error('Error cleaning up approval token:', error);
            }
        }, 2000); // 2 second delay
        
        // Send proper JSON response
        return res.status(200).json({
            success: true,
            message: 'Skill approved and added to user'
        });
    } catch (error) {
        console.error('Error in skill approval:', error);
        return res.status(500).json({
            success: false,
            error: 'Server error while approving skill'
        });
    }
}

module.exports.declineSkill = async (req, res) => {
    const { token } = req.params;
    const pendingSkill = await PendingSkill.findOne({
        approvalToken: token,
        approved: false
    });
    if (!pendingSkill) return res.status(400).json({ error: 'Invalid or expired token' });

    // Option 1: Delete the pending skill
    await PendingSkill.deleteOne({ _id: pendingSkill._id });

    // Option 2: Mark as declined (add a declined field)
    // pendingSkill.declined = true;
    // await pendingSkill.save();

    res.status(200).json({
        message: 'Skill request declined'
    });
}