import User from '../Models/user.model.js'
import { uploadToImagekit } from '../Services/imagekit.service.js'
import { generateToken } from '../Utils/jwtUtil.js'
import bcrypt from 'bcryptjs'

let dummyProfile =
  'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541'

export default class UserController {
  static async signUp(req, res, next) {
    try {
      const { name, email, password } = req.body
      const isExistingUser = await User.findOne({ email })

      if (isExistingUser) {
        return res.status(400).json({ message: 'User already Registered' })
      }

      const hashedPass = await bcrypt.hash(password, 10)
      let uploadedFile = null

      if (req.file) {
        uploadedFile = await uploadToImagekit(req.file, 'profileImage')
      }

      const newUser = new User({
        name,
        email,
        password: hashedPass,
        isPasswordCreated: true,
        profileImage: uploadedFile ? uploadedFile.url : dummyProfile,
        fileId: uploadedFile ? uploadedFile.fileId : null,
      })

      await newUser.save()
      res.status(201).json({ message: 'User created successfully' })
    } catch (err) {
      next(err)
    }
  }

  static async googleSignup(req, res, next) {
    try {
      const { token } = req.body
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      })

      const { name, email, picture, sub } = ticket.getPayload()
      let user = await User.findOne({ email })

      if (!user) {
        user = await User.create({
          name,
          email,
          profileImage: picture,
          fileId: null,
          googleId: sub,
          password: null,
          userType: 'DEFAULT',
        })
        user.save()
      }

      const jwtToken = generateToken({
        userId: user._id,
        name: user.name,
        email: user.email,
      })
      res.status(200).json({ id: user._id, token: jwtToken })
    } catch (err) {
      next(err)
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body
      const isAvailable = await User.findOne({ email })

      if (!isAvailable) {
        return res.status(404).json({ message: 'User not found' })
      }

      const isValidPassword = await bcrypt.compare(
        password,
        isAvailable.password,
      )
      if (!isValidPassword) {
        return res.status(400).json({ message: 'Incorrect credentials' })
      }

      const jwtToken = generateToken({
        userId: isAvailable._id,
        name: isAvailable.name,
        email: isAvailable.email,
        userType: isAvailable.userType,
      })

      res.status(200).json({ id: isAvailable._id, token: jwtToken })
    } catch (err) {
      next(err)
    }
  }

  static async getUserProfile(req, res, next) {
    try {
      const userId = req.params.userId
      const user = await User.findById(userId)

      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }

      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage || dummyProfile,
        fileId: user.fileId,
        googleId: user.googleId,
        userType: user.userType,
      })
    } catch (err) {
      next(err)
    }
  }

  static async updateUserProfile(req, res, next) {
    try {
      const userId = req.params.userId
      const { name, phoneNumber } = req.body
      const user = await User.findById(userId)

      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }

      let newProfileImage = user.profileImage
      let oldImage = { url: user.profileImage, fileId: user.fileId }

      if (req.file) {
        await deleteFromImagekit(oldImage)
        newProfileImage = await uploadToImagekit(req.file, 'profileImage')
      }

      user.name = name || user.name
      user.phoneNumber = phoneNumber || user.phoneNumber
      user.profileImage = newProfileImage.url || newProfileImage
      user.fileId = newProfileImage.fileId || user.fileId

      await user.save()
      res.status(200).json({ message: 'Profile updated successfully', user })
    } catch (err) {
      next(err)
    }
  }
  
}
