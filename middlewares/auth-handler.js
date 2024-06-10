module.exports =  (req, res, next) => {
    if ( req.isAuthenticated() ) {
        return next()
    }

    req.flash('erroe', '尚未登入')
    return res.redirect('/login')
}   