const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: true,
        unique: [true, 'Email is required']
    },
    password: {
        type: String,
        required: [true, ' Password is required'],
        minlength: 5
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("User", UserSchema)