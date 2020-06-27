const express = require('express')
const {protect} = require('../middlewares/auth')
const {getContacts , addContact , updateContact}  = require('../controllers/contact')
const router = express.Router()


// router.get('/:userId/contacts',protect ,getContacts )
router
    .route('/:userId/contacts')
    .get(protect,getContacts)
    .post(protect,addContact)


router
    .route('/:id')
    .patch(protect , updateContact)
module.exports = router
