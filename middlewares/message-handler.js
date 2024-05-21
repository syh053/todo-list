const message = ( req, res, next) => {
    res.locals.success_message = req.flash("success")
    res.locals.error_message = req.flash("error")

    next()
}



module.exports = message