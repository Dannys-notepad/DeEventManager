require('dotenv').config()

const DB = process.env.DB_NAME
const USERNAME = process.env.DB_USER
const PASSWORD = process.env.DB_PASS
const HOST = process.env.DB_HOST
const DIALECT = process.env.DB_DIALECT

const SMTP_USERNAME = process.env.SMTP_USERNAME
const SMTP_PASSWORD = process.env.SMTP_PASSWORD
const SERVICE = process.env.SERVICE

const JWT_SECRET = process.env.JWT_SECRET

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI

const CLOUD_NAME = process.env.CLOUD_NAME
const CLOUD_API_KEY = process.env.CLOUD_API_KEY
const CLOUD_API_SECRET = process.env.CLOUD_API_SECRET
const CLOUDDINARY_URL = process.env.CLOUDDINARY_URL


module.exports = {
    DB,
    USERNAME,
    PASSWORD,
    HOST,
    DIALECT,
    SMTP_USERNAME,
    SMTP_PASSWORD,
    SERVICE,
    JWT_SECRET,
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI,
    CLOUD_NAME,
    CLOUD_API_KEY,
    CLOUD_API_SECRET,
    CLOUDDINARY_URL
}