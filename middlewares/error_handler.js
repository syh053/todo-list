const error = (err, req, res, next) => {

    console.log(err)
    const errorRecord = err.errorMessage
    
    req.flash("error", err.errorMessage || "處理失敗")

    if ( errorRecord.includes("找不到") ) {
        res.redirect("/todos")
    } else {
        res.redirect("back")
    }

    next(error)
}

module.exports = error