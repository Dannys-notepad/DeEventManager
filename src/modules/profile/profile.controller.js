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

exports.completeProfile = async (req, res) => {
    try {
        const { profilePicUrl, bio, tellphoneNumber, socialLinks } = await req.body

        const id = await res.user.id

        const data = {
            profilePicUrl, bio, tellphoneNumber, socialLinks, id
        }
        const completeProfile = await ProfileService.completeProfile(data)
        res.status(completeProfile.status).json({
            response: completeProfile
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