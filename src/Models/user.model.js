import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, lowercase: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String },
    isPasswordCreated: { type: Boolean, default: false },
    googleId: { type: String, sparse: true, default: null},
    phoneNumber: { type: String },
    profileImage: { type: String },
    fileId: { type: String },
  },
  { timestamps: true },
)

const User = mongoose.model('User', userSchema)

export default User