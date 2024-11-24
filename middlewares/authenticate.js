
const jwt = require('jsonwebtoken')
const prisma = require('../models');
const createError = require("../utills/createError");
const tryCatch = require('../utills/tryCatch');


module.exports = tryCatch(async (req, res, next) => {
    const authorization = req.headers.authorization
    if (!authorization || !authorization.startsWith('Bearer ')) {
        createError(401, 'Unauthorized')
    }
    const token = authorization.split(' ')[1]
    if (!token) {
        createError(401, 'Unauthorized')
    }
    console.log('token', token)
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    console.log("ascsacsc")

    const foundUser = await prisma.user.findUnique({ where: { id: payload.id } })
    if (!foundUser) {
        createError(401, 'Unauthorized')
    }
    // delete foundUser.password
    const { password, createdAt, updatedAt, ...userData } = foundUser //เอายกเว้น password, createdAt, updatedAt ที่เหลือจะอยู่ในuserData
    req.user = userData
    next()
})