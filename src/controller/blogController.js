const authorModel = require("../model/authorModel")
const blogModel = require("../model/blogModel")

/*### POST /blogs
- Create a blog document from request body. Get authorId in request body only.
- Make sure the authorId is a valid authorId by checking the author exist in the authors collection.
- Return HTTP status 201 on a succesful blog creation. Also return the blog document. The response should be a JSON object like [this](#successful-response-structure) 
- Create atleast 5 blogs for each author

- Return HTTP status 400 for an invalid request with a response body like [this](#error-response-structure)
*/
const createBlog = async function (req, res) {
    try {
        let data = req.body
        let bodyauthorid = req.body.authorId
        if (!await authorModel.findById(bodyauthorid)) {
            return res.status(400).send({ status: false, msg: "Invalid author id" })
        }
        let record = await blogModel.create(data)
        res.status(201).send({ status: true, data: record })
    }
    catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}

/*### POST /blogs
### GET /blogs
- Returns all blogs in the collection that aren't deleted and are published
- Return the HTTP status 200 if any documents are found. The response structure should be like [this](#successful-response-structure) 
- If no documents are found then return an HTTP status 404 with a response like [this](#error-response-structure) 
- Filter blogs list by applying filters. Query param can have any combination of below filters.
  - By author Id
  - By category
  - List of blogs that have a specific tag
  - List of blogs that have a specific subcategory
example of a query url: blogs?filtername=filtervalue&f2=fv2
*/

const getBlog = async function (req, res) {
    try {
        let obj = { isDeleted: false, isPublished: true }
        //- By author Id
        let authorId = req.query.authorId
        let category = req.query.category
        let tags = req.query.tags
        let subcategory = req.query.subcategory
        
        // //Filter blogs list by applying filters
        if (authorId) { obj.authorId = authorId }//
        if(category) { obj.category = category }
        if(tags) { obj.tags = tags }
        if(subcategory){ obj.subcategory = subcategory}//

        let saveData = await blogModel.find(obj)
        if (saveData.length == 0) {
            return res.status(404).send({status: false , msg : "No document found with this filter"})
        }
        return res.status(200).send({status:true , data : saveData})
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}



// ### PUT /blogs/:blogId
// - Updates a blog by changing the its title, body, adding tags, adding a subcategory. (Assuming tag and subcategory received in body is need to be added)
// - Updates a blog by changing its publish status i.e. adds publishedAt date and set published to true
// - Check if the blogId exists (must have isDeleted false). If it doesn't, return an HTTP status 404 with a response body like [this](#error-response-structure)
// - Return an HTTP status 200 if updated successfully with a body like [this](#successful-response-structure) 
// - Also make sure in the response you return the updated blog document. 


const updateBlog = async function (req,res){

}



// ### DELETE /blogs/:blogId
// - Check if the blogId exists( and is not deleted). If it does, mark it deleted and return an HTTP status 200 without any response body.
// - If the blog document doesn't exist then return an HTTP status of 404 with a body like [this](#error-response-structure) 


const deleteBlogByPath = async function (req,res){

}



// ### DELETE /blogs?queryParams
// - Delete blog documents by category, authorid, tag name, subcategory name, unpublished
// - If the blog document doesn't exist then return an HTTP status of 404 with a body like [this](#error-response-structure)


const deleteBlogByQuery = async function (req , res){

}


module.exports.createBlog = createBlog
module.exports.getBlog = getBlog
module.exports.updateBlog = updateBlog
module.exports.deleteBlogByPath = deleteBlogByPath
module.exports.deleteBlogByQuery = deleteBlogByQuery