const express = require('express')
const postRouter = express.Router()
const postController = require('../controllers/post-controller')
const authenticate = require('../middlewares/authenticate')
const upload = require('../middlewares/upload')

postRouter.get("/", authenticate, postController.getAllPosts)
postRouter.post("/", authenticate, upload.single('image'), postController.createPost)
postRouter.put("/:id", authenticate, upload.single('image'), postController.editPost)
postRouter.delete("/:id", authenticate, postController.deletePost)



module.exports = postRouter