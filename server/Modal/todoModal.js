const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
    todo: [{
        activity: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            default: "Pending"
        }
    }],
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
})

const Todo = mongoose.model("Todo", todoSchema);

module.exports = Todo;
