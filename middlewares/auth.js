const jwt = require('jsonwebtoken')
const asyncHandler = require('../middlewares/asyncHandler')
const ErrorResponse = require('../utils/errorResponse')
const User = require('../models/User')
exports.protect = asyncHandler(async (req,res,next) => {
    let token
    const authHeader = req.headers['authorization']
    if (authHeader && authHeader.startsWith('Bearer')){
        token = authHeader.split(' ')[1]
    }else if (req.cookies.token){
        token = req.cookies.token
    }
    if (!token){
        return next(new ErrorResponse('Not authorize to access this route : empty token' , 401))
    }

    try {
        const user = await User.getVerifiedUserFromToken(token) 
        req.user = user
        next()
    } catch (error) {
        next(error)
    }
})