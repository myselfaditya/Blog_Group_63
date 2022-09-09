
const jwt = require("jsonwebtoken");
const blogModel = require("../model/blogModel");
const mongoose=require('mongoose')

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
        jwt.verify(token, "FunctionUp Group No 63",(err,decodedToken)=>{
            if(err){
                return res.status(404).send({status:false,message:"token is not valid"})
            }
            req.authorId = decodedToken.authorId
            //Set an attribute in request object 
            next();
        })
       
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
        if (req.params.blogId) {
            let blogId = req.params.blogId
            if(!mongoose.isValidObjectId(blogId)){return res.status(400).send({ status: false, msg: "blogId is not in format"})}
            let authordetails = await blogModel.findById(blogId)
            if(!authordetails){
                return res.status(400).send({ status: false, msg: "blogId is invalid"})
            }
            if (authordetails.authorId._id.toString() !== req.authorId) {
                return res.status(403).send({ status: false, msg: "You are not authorized" })
            }
            next()
        }
        else if(Object.keys(req.query).length == 0){
            return res.status(403).send({ Status: false, msg: "You are not authorized provide some details in either in path param or query param" })
        }
        else if(req.query) {
            if(req.query.isPublished=== 'true'){
                req.query.isPublished = true
            }
            else if(req.query.isPublished=== 'false'){
                req.query.isPublished = false
            }
            let findauthorid = await blogModel.find(req.query).select({ authorId: 1, _id: 0 })
            if(findauthorid.length==0){
                return res.status(400).send({status:false,msg:"No document found with given filter"})
            }
            else{
                for(let i = 0; i<findauthorid.length ; i++){
                    if(findauthorid[i].authorId._id.toString() == req.authorId){
                        return next()
                    }
                }
                return res.status(403).send({ Status: false, msg: "You are not authorized" })
            }
        }
        
    }
    catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}



module.exports = { authentication, authorization }