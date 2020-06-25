const { request } = require("express");

const express = require('express')
const { postRegister } = require('../controllers/user')


const router = express.Router()

router.post('/register', postRegister)


module.exports = router