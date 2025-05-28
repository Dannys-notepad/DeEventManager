const newLocal = '../../models/UserProfile'
const UserProfile = require(newLocal)


const returnProfileContent = async (data) => {
    try {
        const userId = await data
        const profileContent = await UserProfile.findOne({ where: {  userId }})
        if(!profileContent){
            return {
                message: 'profile/user do not exist',
                status: 404
            }
        }
        return {
            data: profileContent,
            status: 200
        }
    } catch (e) {
        console.log(e)
        throw new Error(e)
    }
}

const completeProfile = async (data) => {
    try {
        const { userId, profilePicUrl, bio, tellphoneNumber, socialLinks } = await data

        const userProfile = await UserProfile.findOne({ where: {  userId }})
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
            data: profileContent,
            status: 200
        }
    } catch (e) {
        console.log(e)
        throw new Error(e)
    }
}