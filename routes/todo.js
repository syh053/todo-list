const express = require("express")

const router = express.Router()

const db = require("../db/models")
const Todo = db.Todo



router.get("/", (req, res, next) => {

    Todo.findAll({
        raw: true
    })
        .then(todos => res.render("todos", { todos }))
        .catch( err => {
            err.errorMessage = "無法取得 todos 清單"
            next( err )
        })
    
})


router.get("/new", (req, res) => {

    res.render("new", { message: req.flash("error") })

})


router.get("/:id", (req, res, next) => {

    const id = req.params.id
    Todo.findOne({
        where: {
            id: id
        },
        attributes: ["id", "name", "isComplete"],
        raw: true
    })
        .then( todo => {
            if (!todo ) {
                const error = new Error('找不到這個 id !!!')
                error.errorMessage = error.message
                next(error)
            } else {
                res.render("detail", { todo })
            }
            
        })
        .catch( err => {
            err.errorMessage = err.message
            next(err)
        })

})


router.post("/", (req, res, next) => {

    const name = req.body.name

    Todo.create({ name })
        .then(() => {
            req.flash("success", "新增成功")
            res.redirect("/todos")
        })
        .catch( err => {
            err.errorMessage = "新增失敗，字數過長"
            next(err)
        })
    
})


router.get("/:id/edit", (req, res, next) => {

    const id = req.params.id
    Todo.findOne({
        where: { id: id },
        attributes: ["id", "name", "isComplete"],
        raw: true
    })
        .then( todo => {
            if ( !todo ) {
                const error = new Error('找不到這個 id 編輯!!!')
                error.errorMessage = error.message
                next(error)
            } else {
                res.render("edit", { todo })
            }
        } )
        .catch( err => {
            err.errorMessage = '找不到這個 id 編輯!!!'
            next(err)
        })
    
})


router.put("/:id", (req, res, next) => {
    
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
        .then( () => {
            req.flash("success", "編輯成功")
            res.redirect(`/todos/${id}`)
        })
        .catch( err => {
            err.errorMessage = err.message
            next(err)
        })
})


router.delete("/:id", (req, res, next) => {
    
        const id = req.params.id
        Todo.destroy({
            where: { id: id }
        })
            .then(() => {
                req.flash("success", "刪除成功")
                res.redirect("/todos")
            })
            .catch( err => {
                err.errorMessage = err.message
                next(err)
            })
})


module.exports = router