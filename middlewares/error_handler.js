const error = (err, req, res, next) => {
  console.log(err)
  const errorRecord = err.errorMessage || '處理失敗'

  req.flash('error', err.errorMessage || '處理失敗')

  if (errorRecord.includes('找不到')) {
    res.redirect('/todos')
  } else if (errorRecord.includes('超過')) {
    res.redirect('/todos')
  } else {
    res.redirect('back')
  }

  next(error)
}

module.exports = error
