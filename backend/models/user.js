const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {type: String, required: true, unique:true},
    password: {type: String, required: true},
    instituteName: String,
    googleId: { type: String },
    refreshToken: {
        type: String,
    }
}, {timestamps: true});

module.exports = mongoose.model("User", userSchema);