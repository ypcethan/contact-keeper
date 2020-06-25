const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

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

UserSchema.post('save' , async function() {
    const user = this
    if (user.isModified('password')){
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(user.password , salt)
    }
})
module.exports = mongoose.model('User', UserSchema)