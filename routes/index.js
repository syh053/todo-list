const express = require("express")

const router = express.Router()

const todos = require("./todo")


router.use("/todos", todos)


//setup rounter
router.get("/", (req, res) => {
    res.render('index')
})


module.exports = router