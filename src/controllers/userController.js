const UserService = require('../services/UserService')

exports.dashboard = async (req, res) => {
    try {
        const name = await res.user.firstName
        const dashboardContent = await UserService.dashboardContent(name)
        res.status(dashboardContent.status).json({
            response: {
                dashboardContent
            }
        })
    } catch (e) {
        console.error(e)
        res.status(500).json({
            response: {
                error: 'Something went wrong try again later',
                status: 500
            }
        })
    }
    
}

exports.generatePasswordResetLink = async (req, res) => {
    try {
        const id = await res.user.id
        const data = {
            id,
            host: req.get('host'),
            protocol: req.protocol
        }
        const generatePasswordResetLink = await UserService.generatePasswordResetLink(data)
        res.status(generatePasswordResetLink.status).json({
            response: {
                generatePasswordResetLink
            }
        })
    } catch (e) {
        console.error(e)
        res.status(500).json({
            response: {
                error: 'Something went wrong generating a password reset link',
                status: 500
            }
        })
    }
    
}

exports.resetPassword = async (req, res) => {
    try {
        const user = await res.user
        const { token } = await req.params
        const data = {
            user,
            host: req.get('host'),
            protocol: req.protocol
        }
        const resetpassword = await UserService.resetpassword(data)
        res.status(resetpassword.status).json({
            response: {
                resetpassword
            }
        })
    } catch (e) {
        console.error(e)
        res.status(500).json({
            response: {
                error: 'could not reset password',
                status: 500
            }
        })
    }
    
}