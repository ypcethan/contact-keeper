const asyncHandler = require('../middlewares/asyncHandler')
const ErrorResponse = require('../utils/errorResponse')
const User = require('../models/User')
const sendEmail = require('../utils/sendEmail')

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

exports.forgotPassword = asyncHandler(async (req,res,next) => {
    const user = await User.findOne({email: req.body.email})

    if(!user){
        return next(new ErrorResponse(`There is no user with that email : ${req.body.email} ` , 404)) 
    }

    const token = user.getResetPasswordToken()

    // Save the side effecs from reset password token.
    await user.save({
        validateBeforeSave: false
    })
    // Create reset url
    const resetUrl = `${req.protocal}://${req.get('host')}/api/v1/users/resetpassword/${token}`

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`
    try {
        await sendEmail({
            email: user.email,
            subject: 'Password reset token',
            message
        })
  
        return res.status(200).json({
            success: true
        })
    } catch (err) {
        console.error(err)
        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined
  
        await user.save({ validateBeforeSave: false })
  
        return next(new ErrorResponse('Reset email could not be sent', 500))
    }

})

