export default {
  port: process.env.PORT,
  env: process.env.NODE_ENV,
  frontendUrl: process.env.FRONTEND_URL,
  backendUrl: process.env.BACKEND_URL,
  db: {
    hostname: process.env.MONGO_HOSTNAME,
    port: process.env.MONGO_PORT,
    name: process.env.MONGO_DB_NAME,
    username: process.env.MONGO_ADMIN_USERNAME,
    password: process.env.MONGO_ADMIN_PASSWORD
  },
  jwt: {
    expiryTime: process.env.JWT_EXPIRY_TIME,
    privateKey: process.env.JWT_PRIVATE_KEY
  },
  mail: {
    apiKey: process.env.SENDGRID_API_KEY,
    disable: process.env.DISABLE_EMAILS
  }
}