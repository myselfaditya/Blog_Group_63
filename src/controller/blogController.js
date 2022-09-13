const { default: mongoose } = require("mongoose")
const authorModel = require("../model/authorModel")
const blogModel = require("../model/blogModel")




const validdetails=function(details){
    return /^[a-zA-Z,'.\s]{0,150}$/.test(details)
}
const createBlog = async function (req, res) {
    try {
        let data = req.body
        let authorId = req.body.authorId
        if (!data.title) { return res.status(400).send({ status: false, msg: "title name is required" }) }
        if (!data.body) { return res.status(400).send({ status: false, msg: "body name is required" }) }
        if (!data.authorId) { return res.status(400).send({ status: false, msg: "authorId name is required" }) }
        if (!data.category) { return res.status(400).send({ status: false, msg: "category name is required" }) }
        if (authorId) {
            if(!mongoose.isValidObjectId(authorId)){return res.status(400).send({ status: false, msg: "authorId is not in format"})}
            else {
                if (!await authorModel.findById(authorId)) {
                    return res.status(400).send({ status: false, msg: "Author id is not valid" })
                }
            }
        }
        if(data.isPublished){if(typeof(data.isPublished)!== 'boolean'){
            return res.status(400).send({status:false , msg : "isPublished should be in Boolean"})
        }}
        if(data.isPublished==true){
            data.publishedAt=Date()
        }
        
        
        if(!validdetails(data.title) ){return res.status(400).send({status:false,msg:"title should be in string "})}
        if(!validdetails(data.body) ){return res.status(400).send({status:false,msg:"body should be in string "})}
        if(!validdetails(data.category) ){return res.status(400).send({status:false,msg:"category should be in string "})}
        if(data.tags){
        if(!validdetails(data.tags.toString()) ){return res.status(400).send({status:false,msg:"tags should be in string "})}
        }
        if(data.subcategory){
        if(!validdetails(data.subcategory.toString()) ){return res.status(400).send({status:false,msg:"subcategory should be in string "})}
        }
        let record = await blogModel.create(data)
        res.status(201).send({ status: true, data: record })
    }
    catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}



const getBlog = async function (req, res) {
    try {
        let obj = { isDeleted: false, isPublished: true }
        //- By author Id
        let authorId = req.query.authorId
        let category = req.query.category
        let tags = req.query.tags
        let subcategory = req.query.subcategory
        if (authorId) {
            if(!mongoose.isValidObjectId(authorId)){return res.status(400).send({ status: false, msg: "authorId is not in format"})}
            else {
                if (!await authorModel.findById(authorId)) {
                    return res.status(400).send({ status: false, msg: "Author is with this id not in database" })
                }
            }
        }
        if (authorId) { obj.authorId = authorId }
        if (category) { obj.category = category }
        if (tags) { obj.tags = tags }
        if (subcategory) { obj.subcategory = subcategory }

        let saveData = await blogModel.find(obj)
        if (saveData.length == 0) {
            return res.status(404).send({ status: false, msg: "No document found with this filter" })
        }
        return res.status(200).send({ status: true, data: saveData })
    }
    catch (err) {
        console.log(err.message)
        return res.status(500).send({ status: false, msg: err.message })
    }
}






const updateBlog = async function (req, res) {
    try {
        let data = req.body
        let blogId = req.params.blogId

        if (!blogId) { return res.status(400).send({ status: false, msg: "blogid is required" }) }

        if(!mongoose.isValidObjectId(blogId)){return res.status(400).send({ status: false, msg: "blogId is not in format"})}

        let findBlog = await blogModel.findById(blogId)
        if (!findBlog) { return res.status(404).send({ status: false, msg: "Invalid BlogId" }) }

        if (Object.keys(data).length == 0) { return res.status(400).send({ status: false, msg: "please enter blog details in body for updating" }) }

        if (findBlog.isDeleted) { return res.status(404).send({ status: false, msg: "blogs already deleted" }) }

        let obj = {}
        let obj2 = {}

        let title = req.body.title
        let body = req.body.body
        let category = req.body.category
        let tags = req.body.tags
        let subcategory = req.body.subcategory
        let isPublished=req.body.isPublished
        let isDeleted=req.body.isDeleted

        if (title) { obj.title = title }
        if (body) { obj.body = body }
        if (category) { obj.category = category }
        if (tags) { obj2.tags = tags }
        if (subcategory) { obj2.subcategory = subcategory }
        if(isDeleted){
            obj.isDeleted=true
            obj.deletedAt=new Date()
        }
        else{
            obj.isDeleted=false
            obj.deletedAt=null
        }

        if(isPublished){
        obj.publishedAt = new Date(),
            obj.isPublished = true
        }
        else{
            obj.isPublished=false
            obj.publishedAt =null
        }

        let updatedBlog = await blogModel.findOneAndUpdate({ _id:blogId }, {
            $set: obj,
            $push: obj2
        }, { new: true, upsert: true })
        return res.status(200).send({ status: true, data: updatedBlog })
    }
    catch (err) {
        console.log(err.message)
        res.status(500).send({ status: false, msg: err.message })
    }
};





const deleteBlogByPath = async function (req, res) {
    try {
        let blogId = req.params.blogId

    
        if(!mongoose.isValidObjectId(blogId)){return res.status(400).send({ status: false, msg: "blogId is not in format"})}

        let blogVerify = await blogModel.findById(blogId)
        if (!blogVerify) {
            return res.status(404).send({ status: false, msg: "Invalid blog id" })
        }
        if (blogVerify.isDeleted) {
            return res.status(404).send({ status: false, msg: "already deleted" })
        }

        let record = await blogModel.findOneAndUpdate({ _id: blogId, isDeleted: false }, { isDeleted: true, deletedAt: Date.now() }, { new: true })
        res.status(200).send()
    }
    catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }

}





const deleteBlogByQuery = async function (req, res) {
    try {
        
        let authorId = req.query.authorId
        if (authorId) {
            if (!mongoose.isValidObjectId(authorId)) { return res.status(400).send({ status: false, msg: "authorId is not in format" }) }
            else {
                if (!await authorModel.findById(authorId)) {
                    return res.status(400).send({ status: false, msg: "Author id is not valid" })
                }
            }
        }
        let category = req.query.category
        let tags = req.query.tags
        let subcategory = req.query.subcategory
        let isPublished = req.query.isPublished 

        let obj = {}
        if (category) { obj.category = category }
        if (authorId) { obj.authorId = authorId }
        if (tags) { obj.tags = tags }
        if (subcategory) { obj.subcategory = subcategory }
        if(isPublished ===false || isPublished===true){ obj.isPublished = isPublished }
        let deleted = await blogModel.findOne(obj ).select({ isDeleted: 1, _id: 0 })
        if (deleted.isDeleted) { return res.status(404).send({ status: false, msg: "Document already deleted" }) }
        if (Object.keys(obj).length == 0) { return res.status(400).send({ status: false, msg: "No document is enter in filter" }) }
        let deletedocument = await blogModel.updateMany(obj, { isDeleted: true, deletedAt: Date.now() }, { new: true })
        res.status(200).send()
    }
    catch (err) {
        res.status(500).status({ status: false, msg: err.message })
    }

  }
  






module.exports.createBlog = createBlog
module.exports.getBlog = getBlog
module.exports.updateBlog = updateBlog
module.exports.deleteBlogByPath = deleteBlogByPath
module.exports.deleteBlogByQuery = deleteBlogByQuery