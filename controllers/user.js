const asyncHandler = require('../middlewares/asyncHandler')
const ErrorResponse = require('../utils/errorResponse')
const User = require('../models/User')

exports.postRegister = asyncHandler(async (req, res, next) => {
    const userDoc = await User.findOne({ email: req.body.email })
    if (userDoc) {
        res.status(400).send({ msg: 'User already exist' })
    }
    const user = await User.create(req.body)
    res.status(200).send({ msg: 'User created', user: user })
})

exports.postLogin = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body

    const user = await User.findOne({ email: email })
    if (!user ) {
        return next(new ErrorResponse('Invalid credentials', 401))
    }

    const isMatched = await user.matchPassword(password)
    if (!isMatched){
        return next(new ErrorResponse('Invalid credentials', 401))
    }
    const token = user.getJWTToken()
    const options = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
    }
    res.status(200)
        .cookie('token', token ,options )
        .json({
            success: true,
            token,
        })
})

