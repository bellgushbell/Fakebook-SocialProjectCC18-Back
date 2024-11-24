const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()



module.exports = prisma


// one line  modules.export = new (require('@prisma/client')).PrismaClient()