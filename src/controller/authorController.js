const authorModel = require("../model/authorModel")
const validateEmail = require("email-validator")

const createAuthor = async function (req, res) {
    try {
        let data = req.body
        let email = data.email
        if (!validateEmail.validate(email)) return res.status(400).send({ status: false, msg: "Enter a valid email" })

        let authorCreated = await authorModel.create(data)
        res.status(201).send({ data: authorCreated })
    }
    catch (err) {
        console.log("This is the error :", err.message)
        res.status(500).send({ msg: "Error", error: err.message })
    }
}

module.exports.createAuthor = createAuthor