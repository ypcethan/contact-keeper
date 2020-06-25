const asyncHandler = require('../middlewares/asyncHandler')
const User = require('../models/User')
exports.postRegister = asyncHandler(async (req, res, next) => {
    const userDoc = await User.findOne({ email: req.body.email })
    if (userDoc) {
        console.log(`userDoc ${userDoc}`)
        res.status(400).send({ msg: "User already exist" })
    }
    const user = await User.create(req.body)
    res.status(200).send({ msg: "User created", user: user })
})