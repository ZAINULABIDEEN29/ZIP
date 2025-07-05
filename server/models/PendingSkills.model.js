const mongoose = require("mongoose");


const pendingSkillSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Intern",
        required: true
    },
    skill: {
        name: {
            type: String,
            required: true
        },
        category: {
            type: String,
            enum: ['Technical', 'Soft Skills', 'Tools'],
            default: 'Technical'
        },
        level: {
            type: String,
            enum: ['Beginner', 'Intermediate', 'Advanced'],
            default: 'Beginner'
        },
    },
    approvalToken: {
        type: String,
        required: true
    },
    approved: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model("PendingSkill", pendingSkillSchema)