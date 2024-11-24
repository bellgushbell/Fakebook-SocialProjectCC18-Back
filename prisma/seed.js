const bcrypt = require('bcryptjs')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const hashedPassword = bcrypt.hashSync('123456', 10)

const userData = [

    { firstName: "Andy", lastName: 'Codecamp', password: hashedPassword, email: 'andy@ggg.mail', profileImage: 'https://www.svgrepo.com/show/393895/avatar-13.svg' },
    { firstName: "bobby", lastName: 'Codecamp', password: hashedPassword, email: 'bobby@ggg.mail', profileImage: 'https://www.svgrepo.com/show/393899/avatar-19.svg' },
    { firstName: "candy", lastName: 'Codecamp', password: hashedPassword, mobile: "1111111111", profileImage: 'https://www.svgrepo.com/show/393894/avatar-14.svg' },
    { firstName: "benny", lastName: 'Codecamp', password: hashedPassword, mobile: '2222222222', profileImage: 'https://www.svgrepo.com/show/393897/avatar-18.svg' },
]

console.log("DB seed...")


async function run() {
    await prisma.user.createMany({
        data: userData
    })
}

run()