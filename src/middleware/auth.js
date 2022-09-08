
const jwt = require("jsonwebtoken");
const blogModel = require("../model/blogModel");

// /### Authentication
// - Add an authorisation implementation for the JWT token that validates the token before every protected endpoint is called. If the validation fails, return a suitable error message with a corresponding HTTP status code
// - Protected routes are create a blog, edit a blog, get the list of blogs, delete a blog(s)
// - Set the token, once validated, in the request - `x-api-key`
// - Use a middleware for authentication purpose.
//Authentication
const authentication = async function (req, res, next) {
    try {
        let token = req.headers["x-api-key"]
        //If no token is present in the request header return error. This means the user is not logged in.
        if (!token){
            return res.status(400).send({ status: false, msg: "token must be present" });
        }

        // if(!jwt.JsonWebTokenError(token)){
        //     console.log(jwt.JsonWebTokenError(token))
        //     return res.status(400).send({ status: false, msg: "token is not in format"})
        // }
        let decodedToken = jwt.verify(token, "FunctionUp Group No 63")
        if (!decodedToken) return res.status(400).send({ status: false, message: "invalid token" });

        req.authorId = decodedToken.authorId
        //Set an attribute in request object 
        next();
    }
    catch (err) {
        console.log(err.message)
        res.status(500).send({ status: false, msg: err.message })
    }
};

// Make sure that only the owner of the blogs is able to edit or delete the blog.
// - In case of unauthorized access return an appropirate error message.

const authorization = async function (req, res, next) {
    try {

        console.log(req.query)
        if (req.params.blogId) {
            let blogId = req.params.blogId
            let authordetails = await blogModel.findById(blogId)
            console.log(authordetails.authorId._id.toString())
            if (authordetails.authorId._id.toString() !== req.authorId) {
                return res.status(403).send({ status: false, msg: "You are not authorized" })
            }
        }
        else {

            if(req.query.isPublished=== 'true'){
                req.query.isPublished = true
            }
            else if(req.query.isPublished=== 'false'){
                req.query.isPublished = false
            }
            let findauthorid = await blogModel.find(req.query).select({ authorId: 1, _id: 0 })
            console.log(findauthorid)
            if(findauthorid.length>0){
                for(let i = 0; i<findauthorid.length ; i++){
                    if(findauthorid[i].authorId._id.toString() ==req.authorId){
                        return next()
                    }
                }
            }
            console.log(findauthorid)
            if (findauthorid.authorId._id.toString() !== req.authorId) {
                return res.status(403).send({ Status: false, msg: "You are not authorized" })
            }
        }
        next()
    }
    catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}



module.exports = { authentication, authorization }