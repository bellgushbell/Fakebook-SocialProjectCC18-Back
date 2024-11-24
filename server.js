require("dotenv").config()
const express = require('express')
const app = express()
const cors = require('cors')
const notFound = require("./middlewares/not-found")
const errorMiddleware = require("./middlewares/error-middleware")
const authRoute = require("./routes/auth-route")
const postRoute = require("./routes/post-route")
const authenticate = require("./middlewares/authenticate")
const commentRoute = require("./routes/comment-route")
const likeRoute = require("./routes/like-route")

app.use(express.json())
app.use(cors())





app.use('/auth', authRoute)

app.use('/post', authenticate, postRoute)
app.use('/comment', authenticate, commentRoute)
app.use('/like', authenticate, likeRoute)


app.use("*", notFound)
app.use(errorMiddleware)

const port = process.env.PORT || 8800
app.listen(port, () => console.log(`Server on ${port}`))