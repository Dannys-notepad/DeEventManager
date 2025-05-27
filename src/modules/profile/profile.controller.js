const ProfileService = require('./profile.service')

exports.profileContent = async (req, res) => {
    try {
        const data = res.user.id
        const profileContent = await ProfileService.returnProfileContent(data)
        res.status(profileContent.status).json({
            response: {
                profileContent
            }
        })
    } catch (e) {
        console.log(e)
        res.status(500).json({
            response: {
                message: 'something went wrong while processing request',
                status: 500
            }
        })
    }
}

exports.updateProfile = async (req, res) => {
    try {
        
    } catch (e) {
        console.log(e)
        res.status(500).json({
            response: {
                message: 'something went wrong while processing request',
                status: 500
            }
        })
    }
}