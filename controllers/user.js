exports.postRegister = (req, res, next) => {
    console.log("Register")
    console.log(req.body)
    res.status(200).send({ success: true })
}