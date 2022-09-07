const authorModel = require("../model/authorModel")
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
        if( Object.keys(data).length == 0 ) {
            return res.status(400).send({ status: false, message: "data is missing in body"})
        }
        if(!data.fname){return res.status(400).send({status:false,msg:"fname name is required"})}
        if(!data.lname){return res.status(400).send({status:false,msg:"lname name is required"})}
        if(!data.title){return res.status(400).send({status:false,msg:"title name is required"})}
        if(!data.email){return res.status(400).send({status:false,msg:"email name is required"})}
        if(!data.password){return res.status(400).send({status:false,msg:"password name is required"})}
    
        let email = data.email
        // if (!validateEmail.validate(email)) return res.status(400).send({ status: false, msg: "Enter a valid email" })
    
        let validEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        if (!validEmail.test(email)) {
            return res.status(400).send({ status: false, message: "please enter email in  correct format" })
        }
    
        let authorCreated = await authorModel.create(data)
        res.status(201).send({ status : true , data: authorCreated })
    }
    catch (err) {
        console.log("This is the error :", err.message)
        res.status(500).send({ status: false, msg: "Error", error: err.message })
    }
}

module.exports.createAuthor = createAuthor


const login = async function (req, res) {
    try{
        let userName = req.body.emailId;
        let password = req.body.password;
        let user = await authorModel.findOne({ emailId: userName, password: password });
        if (!user)
          return res.status(404).send({
            status: false,
            msg: "username or the password is not corerct",
          });
    
        let token = jwt.sign(
          {
            userId: user._id,
            batch: "plutonium",
            organisation: "FunctionUp",
          },
          "functionup-plutonium-very-very-secret-key"
        );
        res.setHeader("x-auth-token", token);
        res.status(201).send({ status: true, token: token });
    }
    catch(err){
        console.log("This is the error :", err.message)
        res.status(500).send({ status: false, msg: "Error", error: err.message })
    }
}


module.exports.login = login