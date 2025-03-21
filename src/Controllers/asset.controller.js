import Asset from '../Models/asset.model.js'

export default class AssetController {
  static async createAsset(req, res, next) {
    try {
      const userId = req.user.userId

      if (!userId) {
        throw new Error('Token is expired')
      }

      const { symbol, type, quantity, avgPrice } = req.body

      const newAsset = new Asset({
        userId,
        symbol,
        type,
        quantity,
        avgPrice,
      })

      await newAsset.save()
      res.status(201).json({ success: true, asset: newAsset })
    } catch (err) {
      next(err)
    }
  }

  static async updateAsset(req, res, next) {
    try {
      const updatedAsset = await Asset.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true },
      )
      res.status(200).json(updatedAsset)
    } catch (err) {
      next(err)
    }
  }

  static async deleteAsset(req, res, next) {
    try {
      await Asset.findByIdAndUpdate(req.params.id, { isDeleted: true })
      res.status(200).json({ success: true, message: 'Asset is deleted' })
    } catch (err) {
      next(err)
    }
  }

  static async getUserPortfolio(req, res, next) {
    try {
      const userId = req.user.userId
      const assets = await Asset.find({ userId })
      res.status(200).json(assets)
    } catch (err) {
      next(err)
    }
  }
}
