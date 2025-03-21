import express from 'express'
import UserController from '../Controllers/user.controller.js'
import { uploadProfileImage } from '../Middlewares/upload.middleware.js'

const router = express.Router()

router.post('/signup', uploadProfileImage, UserController.signUp)

router.post('/googleSignup', UserController.googleLogin)

router.post('/login', UserController.login)

router.get('/profile/:userId', UserController.getUserProfile)



export default router
