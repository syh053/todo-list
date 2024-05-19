// 建立 server
const express = require("express")
const app = express()
const port = 3000

//載入套件
const { engine } = require("express-handlebars")
const methodOverride = require('method-override')
const session = require("express-session")
const flash = require("connect-flash")


//對所有的 request 進行前置處理
app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(session({
    secret: "This is Secret",
    resave: false,
    saveUninitialized: false
}))
app.use(flash())


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


app.get("/todos", (req, res) => {

    try {
        Todo.findAll({
            raw: true
        })
            .then(todos => res.render("todos", { todos, message: req.flash("success"), error: req.flash("error") }))
            .catch(err => {
                console.log(err)
                req.flash("error", "無法取得 todos 清單")
                res.redirect("back")
            } )    
    } catch (error) {
        console.log(error)
        req.flash("error", "伺服器錯誤")
        res.redirect("back")
    }
})


app.get("/todos/new", (req, res) => {
    
    try {
        res.render("new", { message: req.flash("error") })
    } catch (error) {
        console.log(error)
        req.flash("error", "伺服器錯誤")
        res.redirect("back")
    }
})


app.get("/todos/:id", (req, res) => {
    try {
        const id = req.params.id
        Todo.findOne({
            where: {
                id: id
            },
            attributes: ["id", "name", "isComplete"],
            raw: true
        })
            .then(todo => res.render("detail", { todo, message: req.flash("success") }))
            .catch( err => {
                console.log(err)
                req.flash("error", "無法取得這筆資料")
                res.redirect("back")
            })
    } catch (error) {
        console.log(err)
        req.flash("error", "伺服器錯誤")
        res.redirect("back")
    }
})


app.post("/todos", (req, res) => {
    const name = req.body.name
    try { 
        Todo.create({ name })
            .then(() => {
                req.flash("success", "新增成功")
                res.redirect("/todos")
            })
            .catch( err => {
                console.log(err)
                req.flash("error", "新增失敗，字數過長")
                res.redirect("back")
            } ) 
    } catch (error) { 
        err => console.log(err)
        req.flash("error", "伺服器錯誤")
        res.redirect("back")
    }
})


app.get("/todos/:id/edit", (req, res) => {
    try {
        const id = req.params.id
        Todo.findOne({
            where: { id: id },
            attributes: ["id", "name", "isComplete"],
            raw: true
        })
            .then(todo => res.render("edit", { todo, error: req.flash("error") }))
            .catch(err => {
                console.log(err)
                req.flash("error", "資料取得失敗")
                res.redirect("back")
            } )
    } catch (error) {
        console.log(err)
        req.flash("error", "伺服器錯誤")
        res.redirect("back")
        
    }
})


app.put("/todos/:id", (req,res) => {
    try {
        const id = req.params.id
        const name = req.body.name
        const { completed } = req.body
        Todo.update(
            {
                name: name,
                isComplete: completed === "isCompleted"
            },
            { where: { id: id } }
        )
            .then(() => {
                req.flash("success", "編輯成功")
                res.redirect(`/todos/${id}`)
            })
            .catch( err => {
                console.log(err)
                req.flash("error", "編輯失敗")
                res.redirect("back")
            } )
    } catch (error) {
        console.log(err)
        req.flash("error", "伺服器錯誤")
        res.redirect("back")  
    }
})


app.delete("/todos/:id", (req, res) => {
    try {
        const id = req.params.id
        Todo.destroy({
            where: { id: id }
        })
            .then(() => {
                req.flash("success", "刪除成功")
                res.redirect("/todos")
            })
            .catch(err => {
                console.log(err)
                req.flash("error", "刪除失敗")
                res.redirect("back") 
            } )
    } catch (error) {
        console.log(err)
        req.flash("error", "伺服器錯誤")
        res.redirect("back")
    }
})


//express.listening
app.listen( 3000, () => {
    console.log(`express server is running on http://localhost:${port}`)
})

