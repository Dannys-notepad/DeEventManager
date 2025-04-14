module.exports = async (req, res, next) => {
  console.log(`[request logger] ${req.ip} ${req.method} ${req.url}`)
  next()
}