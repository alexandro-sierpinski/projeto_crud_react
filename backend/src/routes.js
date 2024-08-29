const express= require("express")

const routes = express.Router()
const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

//C
routes.post("/todos", async (req, res) => {
    const {name} = req.body
    const todo = await prisma.todo.create({data: {
        name
    }})
    return res.status(201).json(todo)
})

//R
routes.get("/todos", async (req, res) => {
    const todo = await prisma.todo.findMany()
    return res.status(200).json(todo)
})
//U
routes.put("/todos", async (req, res) => {
    const { id, name, status } = req.body

    if(!id) {
        return res.status(400).json("Id is mandatory")
    }

    const todoAlreadyExist = await prisma.todo.findUnique({where: {id}})

    if(!todoAlreadyExist){
        return res.status(404).json("Todo not exist")
    }

    const todo = await prisma.todo.update({ where: {
            id,
        },
        data: {
            name,
            status
        }
    })

    return res.status(200).json(todo)
})

//D
routes.delete("/todos/:id", async (req, res) => {
    const { id } = req.params

    const idCopy = parseInt(id)

    if(!idCopy) {
        return res.status(400).json("Id is mandatory")
    }

    const todoAlreadyExist = await prisma.todo.findUnique({
        where: { id: idCopy }
    })

    if(!todoAlreadyExist){
        return res.status(404).json("Todo not exist")
    }

    await prisma.todo.delete({where: { id: idCopy }})    
    return res.status(200).send()
})

module.exports = routes