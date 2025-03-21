import express from 'express'
import AssetController from '../Controllers/asset.controller.js'
import authMiddleware from '../Middlewares/auth.middleware.js'

const router = express.Router()

router.post('/add', authMiddleware, AssetController.createAsset)

router.put('/update/:id', authMiddleware, AssetController.updateAsset)

router.delete('/delete/:id', authMiddleware, AssetController.deleteAsset)

router.get(
  '/portfolio/:userId',
  authMiddleware,
  AssetController.getUserPortfolio,
)

export default router
