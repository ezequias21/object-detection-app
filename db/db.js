
const Mongoose = require("mongoose")
const config = require('../src/config/config')

const connectDB = async () => {
  await Mongoose.connect(config.database.url)

  console.log("MongoDB Connected")
}


module.exports = connectDB