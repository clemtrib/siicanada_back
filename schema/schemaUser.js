import mongoose from "mongoose"
import passwordHash from "password-hash"
import jwt from "jwt-simple"
import config from "../config/config"

const userSchema = mongoose.Schema({
    email: {
        type: String,
        lowercase: true,
        trim: true,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, { timestamps: { createdAt: "created_at" } })


userSchema.methods = {
    authenticate: function (password) {
        return passwordHash.verify(password, this.password)
    },
    getToken: function () {
        return jwt.encode(this, config.secret)
    }
}

module.exports = mongoose.model("User", userSchema)
