const newLocal = '../../models/UserProfile'
const UserProfile = require(newLocal)


exports.returnProfileContent = async (data) => {
    try {
        const id = await data
        const profileContent = await UserProfile.findOne({ where: {  id }})
        if(!profileContent){
            return {
                message: 'profile/user do not exist',
                status: 404
            }
        }
        return {
            profile: profileContent,
            status: 200
        }
    } catch (e) {
        console.log(e)
        throw new Error(e)
    }
}

exports.completeProfile = async (data) => {
    try {
        const { id, profilePicUrl, bio, tellphoneNumber, socialLinks } = await data

        const userProfile = await UserProfile.findOne({ where: { id }})
        if(!userProfile){
            return {
                message: 'profile/user do not exist',
                status: 404
            }
        }

        userProfile.tellphoneNumber = tellphoneNumber
        userProfile.profilePicUrl = profilePicUrl
        userProfile.socialLinks = socialLinks
        userProfile.bio = bio
        await userProfile.save()


        return {
            message: 'profile updated successfully',
            profile: userProfile,
            status: 200
        }
    } catch (e) {
        throw new Error(e)
    }
}