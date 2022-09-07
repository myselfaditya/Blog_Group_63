const express = require('express');
const router = express.Router();
const authorController = require('../controller/authorController')
const blogController = require('../controller/blogController')
const middleware=require("../middleware/auth")

router.post('/authors',authorController.createAuthor)

router.post('/login' , authorController.login)

router.post('/blogs',middleware.authentication, blogController.createBlog)

router.get('/blogs', middleware.authentication, blogController.getBlog)

router.put('/blogs/:blogId' , middleware.authentication,middleware.authorization, blogController.updateBlog)

router.delete('/blogs/:blogId', middleware.authentication,middleware.authorization, blogController.deleteBlogByPath)

router.delete('/blogs', middleware.authentication, blogController.deleteBlogByQuery)



module.exports = router;