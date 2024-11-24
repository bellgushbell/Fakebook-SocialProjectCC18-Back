
const prisma = require('../models/index')
const tryCatch = require('../utills/tryCatch')
const cloudinary = require('../config/couldinary')
const path = require('path')
const fs = require('fs/promises')
const createError = require('../utills/createError')
const getPublicId = require('../config/getPublicId')


module.exports.getAllPosts = tryCatch(async (req, res) => {
    const rs = await prisma.post.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            user: {
                select: {
                    firstName: true, lastName: true, profileImage: true
                }
            },
            comments: {
                include: {
                    user: {
                        select: {
                            firstName: true, lastName: true, profileImage: true
                        }
                    }
                }
            },
            Like: {
                include: {
                    user: {
                        select: {
                            firstName: true, lastName: true, profileImage: true
                        }
                    }
                }
            }
        }
    })
    res.json({ posts: rs })
})


module.exports.createPost = tryCatch(async (req, res, next) => {
    const { message } = req.body

    const haveFile = !!req.file //check ว่ามี ไฟล์ใหม แปลงเป็นboolean

    let uploadResult = {}
    if (haveFile) {
        uploadResult = await cloudinary.uploader.upload(req.file.path, {
            overwrite: true,
            public_id: path.parse(req.file.path).name,
        })
        fs.unlink(req.file.path)
    }
    //ลบไฟล์ ในโฟลเดอร์ upload-pic เพราะเข้าcloudinary แล้ว


    const data = {
        message: message,
        image: uploadResult.secure_url || '', //ใช้secure_url มาจาก log uploadResult เป็นลิ้งค์ที่เข้าได้จากทุกที่เลยใช้
        userId: req.user.id,
    }
    const rs = await prisma.post.create({
        data: data
    })
    res.json(rs)
    // console.log(req.file)
    // cloudinary.uploader.upload(req.file.path)
    // const data = { message, userId: req.user.id }
    // const rs = await prisma.post.create({ data })
    console.log(uploadResult)
    // res.json(uploadResult)
})

module.exports.editPost = tryCatch(async (req, res, next) => {
    const { id } = req.params
    const { message } = req.body

    console.log(id)
    console.log(message)
    console.log(req.file)


    const postData = await prisma.post.findUnique({ where: { id: +id } })
    if (!postData || req.user.id !== postData.userId) {
        createError(401, "cannot Update")
    }

    const haveFile = !!req.file //convert to boolean chack ว่ามีใหมด้วย
    let uploadResult = {}
    if (haveFile) {
        uploadResult = await cloudinary.uploader.upload(req.file.path, { //เพิ่มไฟล์ รูปใหม่
            public_id: path.parse(req.file.path).name,
        })
        fs.unlink(req.file.path)
        if (postData.image) ( //ถ้ามีรูปเก่าอยู่ ลบไฟลืในclodinary 
            cloudinary.uploader.destroy(getPublicId(postData.image)) //ลบรูปเก่า
        )
    }
    console.log('uploadResult', uploadResult)
    const data = haveFile ? { message, image: uploadResult.secure_url, userId: req.user.id }
        : { message, userId: req.user.id }


    //removepic logic ลองทำ    


    const rs = await prisma.post.update({
        where: { id: +id },
        data: data
    })

    res.json(rs)
}

)

module.exports.deletePost = tryCatch(async (req, res) => {
    console.log(req.params)
    const { id } = req.params
    const postData = await prisma.post.findUnique({ where: { id: +id } }) //check ว่าล็อกอินทางpostman ถ้าไม่ตรงกับไม่ให้ลบ 
    if (postData.userId === req.user.id) {
        createError(401, "Cannot delete")
    }
    const rs = await prisma.post.delete({
        where: { id: +id }
    })
    res.json(rs)
})