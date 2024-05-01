const express = require("express")
const app = express()
const port = 3000


//setup rounter
app.get( "/", (req, res) => {
    res.send("express test.")
})


//express.listening
app.listen( 3000, () => {
    console.log(`express server is running on http://localhost:${port}`)
})

