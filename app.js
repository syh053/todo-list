const express = require("express")
const app = express()
const port = 3000


//setup rounter
app.get("/", (req, res) => {
    res.redirect("/todos")    
})


app.get("/todos", (req, res) => {
    res.send("show all todos")
})


app.get("/todos/:id", (req, res) => {
    const id = req.params.id
    res.send(`get todo : ${id}.`)
})


app.get("/todos/new", (req, res) => {
    const id = req.params.id
    res.send("create todo")
})


app.post("/todos", (req, res) => {
    res.send("add todo")
})


app.get("/todos/:id/edit", (req, res) => {
    const id = req.params.id
    res.send(`get todo edit : ${id} `)
})


app.put("/todos/:id", (req,res) => {
    const id = req.params.id
    res.send(`modify todo : ${id}`)
})


app.delete("/todos/:id", (req, res) => {
    const id = req.params.id
    res.send(`delete todo : ${id}`)
})


//express.listening
app.listen( 3000, () => {
    console.log(`express server is running on http://localhost:${port}`)
})

