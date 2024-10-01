require("dotenv").config()
const express = require('express')
const app = express()

app.use(express.json())

const port = process.env.PORT || 8800



app.listen(port, () => console.log(`Server on ${port}`))