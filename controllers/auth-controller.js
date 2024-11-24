
const prisma = require('../models/index')
const tryCatch = require('../utills/tryCatch')
const createError = require('../utills/createError')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

function checkEmailorPhone(identity) {
    let identityKey = ''
    if (/^[0-9]{10,15}$/.test(identity)) {
        identityKey = 'mobile'
    }
    if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(identity)) {
        identityKey = 'email'
    }
    if (!identityKey) {
        createError(400, 'only email or phone number')
    }
    return identityKey
}


module.exports.register = tryCatch(async (req, res, next) => {
    const { identity, firstName, lastName, password, confirmPassword } = req.body

    //check identity is mobile or email
    let identityKey = checkEmailorPhone(identity)





    //check if already email / mobile in User data
    const findIdentity = await prisma.user.findUnique({
        where: {
            [identityKey]: identity, //[]คือรับค่ามาจากตัวแปร คือการเอา string ใน identityKey มาเป็นชื่อ key // mobile or email
        }
    })

    if (findIdentity) {
        createError(409, `Already have this ${identityKey}`)
    }


    //create user in db
    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = {
        [identityKey]: identity, //[]คือรับค่ามาจากตัวแปร คือการเอา string ใน identityKey มาเป็นชื่อ key // mobile or email
        password: hashedPassword,
        firstName,
        lastName
    }

    const result = await prisma.user.create({ data: newUser })

    res.json({ msg: 'Register Controller...', result })
})








module.exports.login = tryCatch(async (req, res, next) => {

    const { identity, password } = req.body
    // console.log(req.body)
    //validation
    if (!(identity.trim() && password.trim())) {
        createError(400, "Please fill all data")
    }
    //check identity is mobile or email
    let identityKey = checkEmailorPhone(identity)


    //find user
    const findUser = await prisma.user.findUnique({

        where: {
            [identityKey]: identity,
        }
    })
    // console.log(findUser)
    if (!findUser) {
        createError(401, 'invalid login')
    }

    //check password
    let pwOk = await bcrypt.compare(password, findUser.password)
    if (!pwOk) {
        createError(401, 'invalid login')
    }

    const payLoad = {
        id: findUser.id
    }

    const token = jwt.sign(payLoad, process.env.JWT_SECRET, { expiresIn: "30d" })
    const { password: pw, createdAt, updatedAt, ...UserData } = findUser //keyที่ไม่อยากเอ pw is rename สิ่งที่เหลือจะมาอยู่ในUserData เราจะส่งUserData
    res.json({ token: token, user: UserData }) //ส่งไปzustand login
})


module.exports.getMe = tryCatch(async (req, res, next) => {

    res.json({ user: req.user })

})