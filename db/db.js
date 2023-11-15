
const Mongoose = require("mongoose")
const mongodbURL = 'mongodb+srv://ezequiasantunes18:caiTJRpVHv4F7sJA@cluster0.0y7izvj.mongodb.net/?retryWrites=true&w=majority'

const connectDB = async () => {
  await Mongoose.connect(mongodbURL)

  console.log("MongoDB Connected")
}


module.exports = connectDB