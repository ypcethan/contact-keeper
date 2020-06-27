const express = require('express')
const { postRegister, postLogin ,forgotPassword, resetPassword} = require('../controllers/user')


const router = express.Router()

router.post('/register', postRegister)
router.post('/login' , postLogin )
router.post('/forgotpassword' , forgotPassword )
// router.post('/resetpassword/:resetToken' , resetPassword )
module.exports = router