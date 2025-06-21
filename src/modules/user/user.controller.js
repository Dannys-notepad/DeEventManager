const { response } = require('express')
const UserService = require('./user.service')

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
                error: 'Internal Server Error',
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
        const resetpassword = await UserService.resetPassword(data)
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


// USER ACCOUNT DELETE CONTROLLER
exports.deleteAccount = async (req, res) => {
    try {
        const { password } = await req.body
        const userId = await res.user.id
        const data = {
            password,
            userId
        }
        const deleteAccount = await UserService.deleteAccount(data)
        res.status(deleteAccount.status).json({
            response: {
                deleteAccount
            }
        })
    } catch (e) {
        console.error(e)
        res.status(500).json({
            response: {
                error: 'Internal Server Error'
            }
        })
    }
}

// USER LOGOUT CONTROLLER
exports.logout = async (req, res) => {
    try {
        const userId = await res.user.id
        const token = req.headers.authorization.substring(7)
        const data = {
            userId,
            token
        }
        const logout = await UserService.logout(data)
        res.status(logout.status).json({
            response: logout
        })
    } catch (e) {
        console.error(e)
        res.status(500).json({
            response: {
                error: 'Internal Server Error',
                status: '500'
            }
        })        
    }
}