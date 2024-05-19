const express = require("express")

const router = express.Router()

const db = require("../db/models")
const Todo = db.Todo



router.get("/", (req, res) => {

    try {
        Todo.findAll({
            raw: true
        })
            .then(todos => res.render("todos", { todos, message: req.flash("success"), error: req.flash("error") }))
            .catch(err => {
                console.log(err)
                req.flash("error", "無法取得 todos 清單")
                res.redirect("back")
            })
    } catch (error) {
        console.log(error)
        req.flash("error", "伺服器錯誤")
        res.redirect("back")
    }
})


router.get("/new", (req, res) => {

    try {
        res.render("new", { message: req.flash("error") })
    } catch (error) {
        console.log(error)
        req.flash("error", "伺服器錯誤")
        res.redirect("back")
    }
})


router.get("/:id", (req, res) => {
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
            .catch(err => {
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


router.post("/", (req, res) => {
    const name = req.body.name
    try {
        Todo.create({ name })
            .then(() => {
                req.flash("success", "新增成功")
                res.redirect("/todos")
            })
            .catch(err => {
                console.log(err)
                req.flash("error", "新增失敗，字數過長")
                res.redirect("back")
            })
    } catch (error) {
        err => console.log(err)
        req.flash("error", "伺服器錯誤")
        res.redirect("back")
    }
})


router.get("/:id/edit", (req, res) => {
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
            })
    } catch (error) {
        console.log(err)
        req.flash("error", "伺服器錯誤")
        res.redirect("back")

    }
})


router.put("/:id", (req, res) => {
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
            .catch(err => {
                console.log(err)
                req.flash("error", "編輯失敗")
                res.redirect("back")
            })
    } catch (error) {
        console.log(err)
        req.flash("error", "伺服器錯誤")
        res.redirect("back")
    }
})


router.delete("/:id", (req, res) => {
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
            })
    } catch (error) {
        console.log(err)
        req.flash("error", "伺服器錯誤")
        res.redirect("back")
    }
})


module.exports = router