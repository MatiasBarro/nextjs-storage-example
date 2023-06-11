const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

prisma.user.createMany({
    data: [
        {name: 'Alice', email: 'alice@mbarro.com'},
        {name: 'Bob', email: 'bob@mbarro.com'},
        {name: 'Peter', email: 'pete@mbarro.com'},
    ]
})
.then((payload) => console.log(`User seeding done - ${payload.count} regs created`))
.catch((err) => console.error('Error on user seeding', err))