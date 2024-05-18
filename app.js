// 建立 server
const express = require("express")
const app = express()
const port = 3000

//載入套件
const { engine } = require("express-handlebars")
const methodOverride = require('method-override')


//對所有的 request 進行前置處理
app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))


const db = require("./db/models")
const { where } = require("sequelize")
const Todo = db.Todo

app.engine('.hbs', engine({ extname: '.hbs' })) 
app.set('view engine', '.hbs')
app.set('views', './views')


//setup rounter
app.get("/", (req, res) => {
    res.render('index')
})


app.get("/todos", (req, res) => 
    
    Todo.findAll( {
        // attributes: ["id", "name"],
        raw: true
    })
        .then( todos => res.render("todos", {todos} ))

        .catch( err => res.status(422).json(err)) 
)


app.get("/todos/new", (req, res) => res.render("new"))


app.get("/todos/:id", (req, res) => {
    const id = req.params.id
    Todo.findOne({
        where: {
            id: id
        },
        attributes: [ "id", "name" ],
        raw: true
    } )
        .then( todo => res.render("detail", { todo }) )
        .catch(err => console.log(err))
})


app.post("/todos", (req, res) => {
    const name = req.body.name
    Todo.create( {name} )
        .then( () => res.redirect("/todos") )
        .catch( err => console.log(err) )
})


app.get("/todos/:id/edit", (req, res) => {
    const id = req.params.id
    Todo.findOne({
        where: {  id: id },
        attributes: ["id","name"],
        raw: true
    })
        .then(todo => res.render("edit", { todo }))
        .catch(err => console.log(err))
})


app.put("/todos/:id", (req,res) => {
    const id = req.params.id
    const name = req.body.name
    console.log(id)
    console.log(name)
    Todo.update( 
        { name: name },
        { where: { id: id } }
    )
        .then( () => res.redirect(`/todos/${id}`) )
        .catch(err => console.log(err))
})


app.delete("/todos/:id", (req, res) => {
    const id = req.params.id
    Todo.destroy({ where: { id: id }
     })
        .then( () => res.redirect("/todos"))
        .catch(err => console.log(err))

})


//express.listening
app.listen( 3000, () => {
    console.log(`express server is running on http://localhost:${port}`)
})

