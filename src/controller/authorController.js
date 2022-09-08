const authorModel = require("../model/authorModel")
const jwt = require("jsonwebtoken")
// const validateEmail = require("email-validator")



/*
### Author APIs /authors
- Create an author - atleast 5 authors
- Create a author document from request body.
  `Endpoint: BASE_URL/authors`
*/

const createAuthor = async function (req, res) {
    try {
        let data = req.body
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "data is missing in body" })
        }
        if (Object.keys(data).length > 5) {
            return res.status(400).send({ status: false, message: "data is exceeding" })
        }
        if (!data.fname) { return res.status(400).send({ status: false, msg: "fname name is required" }) }
        if (!data.lname) { return res.status(400).send({ status: false, msg: "lname name is required" }) }
        if (!data.title) { return res.status(400).send({ status: false, msg: "title name is required" }) }
        if (!data.email) { return res.status(400).send({ status: false, msg: "email name is required" }) }
        if (!data.password) { return res.status(400).send({ status: false, msg: "password name is required" }) }
        //"/^[a-zA-Z\s]{0,255}$/"
        validfname=/^[a-zA-Z\s]{2,15}$/
        if(!validfname.test(data.fname)){return res.status(400).send({status:false,msg:"fname is not in format"})}
        let email = data.email
        // if (!validateEmail.validate(email)) return res.status(400).send({ status: false, msg: "Enter a valid email" })
        if(data.title !="Mr" && data.title !="Mrs" && data.title !="Miss"){return res.status(400).send({status:false,msg:"Use valid "})}
        let validEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        if (!validEmail.test(email)) {
            return res.status(400).send({ status: false, msg: "please enter email in  correct format  e.g  xyz@abc.com" })
        }
        let password = data.password
        validPassword = /^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[!#$%&?@ "]).*$/
        if (!validPassword.test(password)) {
            return res.status(400).send({ status: false, msg: "Password must contain 8 characters and at least one number, one letter and one unique character such as !#$%&? " })
        }
        if(await authorModel.findOne({email:data.email})){return res.status(400).send({status:false,msg:"Email already exits"})}
        let authorCreated = await authorModel.create(data)
        console.log(authorCreated)
        res.status(201).send({ status: true, data: authorCreated })
    }
    catch (err) {
        console.log("This is the error :", err.message)
        res.status(500).send({ status: false, msg: "Error", error: err.message })
    }
}

module.exports.createAuthor = createAuthor


const login = async function (req, res) {
    try {
        let email = req.body.email;
        let password = req.body.password;
        let data = req.body
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "data is missing in body" })
        }
        if (Object.keys(data).length > 2) {
            return res.status(400).send({ status: false, message: "data is exceeding" })
        }
        if (!email) { return res.status(400).send({ status: false, msg: "email is required" }) }
        if (!password) { return res.status(400).send({ status: false, msg: "password is required" }) }
        let validEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        if (!validEmail.test(email)) {
            return res.status(400).send({ status: false, message: "please enter email in  correct format" })
        }
        let author = await authorModel.findOne({ email: email, password: password });
        if (!author)
            return res.status(404).send({
                status: false,
                msg: "email or the password is not corerct",
            });

        let token = jwt.sign(
            {
                authorId: author._id,
                batch: "plutonium",
                organisation: "FunctionUp",
            },
            "FunctionUp Group No 63"
        );
        res.setHeader("x-api-key", token);
        res.status(201).send({ status: true, token: token });
    }
    catch (err) {
        console.log("This is the error :", err.message)
        res.status(500).send({ status: false, msg: "Error", error: err.message })
    }
}


module.exports.login = login