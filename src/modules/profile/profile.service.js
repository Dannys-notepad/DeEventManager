const Users = require('../../models/Users')
const newLocal = '../../models/UserProfile'
const UserProfile = require(newLocal)


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


exports.completeProfile = async (data) => {
  try {
    const { id, profilePicUrl, bio, tellphoneNumber, socialLinks } = await data;

    const user = await Users.findOne({
      where: { id },
      attributes: ['firstName', 'lastName', 'email', 'username']
    });

    if (!user) {
      return {
        message: 'User does not exist',
        status: 404
      };
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

    userProfile.tellphoneNumber = tellphoneNumber;
    userProfile.profilePicUrl = profilePicUrl;
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
