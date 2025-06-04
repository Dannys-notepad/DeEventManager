const ProfileService = require('./profile.service')

exports.profileContent = async (req, res) => {
    try {
        const data = res.user.id
        const profile = await ProfileService.returnProfileContent(data)
        res.status(profile.status).json({
            response: {
                profile
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
        const body = await req.body

        const id = await res.user.id

        
        const filePath = req.file.path
        console.log(filePath)

        const data = {
            body, filePath, id
        }
        const updateProfile = await ProfileService.updateProfile(data)
        res.status(updateProfile.status).json({
            response: updateProfile
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