const authorModel = require("../model/authorModel")
const blogModel= require("../model/blogModel")
/*### POST /blogs
- Create a blog document from request body. Get authorId in request body only.
- Make sure the authorId is a valid authorId by checking the author exist in the authors collection.
- Return HTTP status 201 on a succesful blog creation. Also return the blog document. The response should be a JSON object like [this](#successful-response-structure) 
- Create atleast 5 blogs for each author

- Return HTTP status 400 for an invalid request with a response body like [this](#error-response-structure)
*/
const createBlog= async function (req, res) {
    try{
    let data=req.body
    let bodyauthorid = req.body.authorId
    if(!await authorModel.findById(bodyauthorid)){
        return res.status(400).send({status:false,msg:"Invalid author id"})
    }
    let record=await blogModel.create(data)
    res.status(201).send({status:true,data:record})

}
catch(err){
res.status(500).send({status:false,msg:err.message})
}
}



module.exports.createBlog=createBlog