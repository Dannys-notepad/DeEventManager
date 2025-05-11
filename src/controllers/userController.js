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

// PASSOWRD RESET CONTROLLER
exports.resetPassword = async (req, res) => {
    try {
        const id = await res.user.id
        const { oldPassword, newPassword } = await req.body
        const data = {
            id,
            oldPassword,
            newPassword
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