const Users = require('../../models/Users')
const newLocal = '../../models/UserProfile'
const UserProfile = require(newLocal)
const uploadToCloud = require('../../services/cloud-upload.service')
const path = require('path')


exports.returnProfileContent = async (data) => {
  try {
    const userId = await data; 
    const user = await Users.findOne({
      where: { id: userId },
      attributes: ['firstName', 'lastName', 'email', 'username']
    });

    if (!user) {
      return {
        message: 'User does not exist',
        status: 404
      };
    }

    const profile = await UserProfile.findOne({
      where: { id: userId } 
    });

    if (!profile) {
      return {
        message: 'User profile does not exist',
        status: 404
      };
    }

    const profileContent = {
      ...profile.get({ plain: true }),
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    };

    return {
      profileContent,
      status: 200
    };

  } catch (e) {
    console.error(e);
    throw new Error(e);
  }
}


exports.updateProfile = async (data) => {
  try {
    const { id, filePath } = await data;

    const { bio, tellphoneNumber, socialLinks } = await data.body;

    const user = await Users.findOne({
      where: { id }
    });

    if (!user) {
      return {
        message: 'User does not exist',
        status: 404
      };
    }

    if(user.username === null && data.body.username){
      user.username = data.body.username
      await user.save()
    }

    const userProfile = await UserProfile.findOne({
      where: { id }
    });

    if (!userProfile) {
      return {
        message: 'User profile does not exist',
        status: 404
      };
    }

    const profilePicUrl = await uploadToCloud(filePath)
    //console.log(profilePicUrl)

    userProfile.tellphoneNumber = tellphoneNumber;
    userProfile.profilePicUrl = profilePicUrl.cropped;
    userProfile.socialLinks = socialLinks;
    userProfile.bio = bio;
    userProfile.profileIsComplete = true;
    await userProfile.save();

    const profile = {
      ...userProfile.get({ plain: true }),
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email
    };

    return {
      message: 'Profile updated successfully',
      profile,
      status: 200
    };

  } catch (e) {
    console.error(e);
    throw new Error(e);
  }
};
