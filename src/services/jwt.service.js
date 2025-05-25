const jwt = require('jsonwebtoken')

exports.linkToken = async (user) => {
    const accessToken = jwt.sign(
        {userId: user.id}, process.env.JWT_SECRET, {expiresIn: '5m'}
    )

    return accessToken
}

exports.accessToken = async (user) => {
    const accessToken = jwt.sign(
        {userId: user.id}, process.env.JWT_SECRET, {expiresIn: '24hrs'}
    )

    const refreshtoken = jwt.sign(
        {userId: user.id}, process.env.JWT_REFERESH_SECRET, {expiresIn: '7d'}
    )


    return accessToken
}