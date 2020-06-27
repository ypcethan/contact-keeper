const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middlewares/asyncHandler')
const Contact = require('../models/Contact')
const User = require('../models/User')


exports.getContacts = asyncHandler( async (req,res,next) => {
    res.send({
        userID: req.params.userId,
        message: 'Contacts'
    })    
})

exports.addContact = asyncHandler(async (req,res,next) => {
    const contact = await Contact.create(req.body)
    contact.user = req.user._id
    res.send({
        contact
    })
})

exports.updateContact = asyncHandler(async (req,res,next) => {
    let contact = await Contact.findById(req.params.id) 

    if (!contact){
        next(new ErrorResponse(`Course with id : ${req.params.id} does not exist` , 404))
    }
    if (contact.user.id.toString() !== req.user.id){
        next(new ErrorResponse(`User ${req.user.id} is not authorize to update this contact` , 403))
    }
    contact = await Contact.findByIdAndUpdate(req.params.id , req.body, {
        new: true,
        runValidators: true
    })
    res.status(200).json({success: true , contact})
})