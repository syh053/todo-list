const express = require("express")
const app = express()
const port = 3000

const { engine } = require("express-handlebars")

//對所有的 request 進行前置處理
app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }))

const db = require("./models")
const Todo = db.Todo

app.engine('.hbs', engine({ extname: '.hbs' }))
app.set('view engine', '.hbs')
app.set('views', './views')


//setup rounter
app.get("/", (req, res) => {
    res.render('index')
})


app.get("/todos", (req, res) => Todo.findAll( {
        attributes: ["id", "name"],
        raw: true
    } )
        .then( todos => res.render("todos", {todos} ))

        .catch( err => res.status(422).json(err)) 
)


app.get("/todos/new", (req, res) => {
    res.render("new")
})


app.get("/todos/:id", (req, res) => {
    const id = req.params.id
    res.send(`get todo : ${id}.`)
})


app.post("/todos", (req, res) => {
    const name = req.body.name
    Todo.create( {name} )
        .then( () => res.redirect("/todos") )
        .catch( err => console.log(err) )
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

