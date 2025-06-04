const cloudinary = require('cloudinary').v2
const env = require('./env')
const cloud_name = env.CLOUD_NAME
const api_key = env.CLOUD_API_KEY
const api_secret = env.CLOUD_API_SECRET


cloudinary.config({ 
    cloud_name,
    api_key,
    api_secret
});

module.exports = cloudinary