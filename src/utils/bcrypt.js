const bcryptjs = require('bcryptjs')

exports.encrypt = async (password) => {
  const salt = bcryptjs.genSaltSync(10)
  const hash = bcryptjs.hashSync(password, salt)
  return hash
}

exports.decrypt = async (password, hash) => {
  return bcryptjs.compareSync(password, hash)
}