import mongoose from 'mongoose'

const AssetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    symbol: { type: String, required: true },
    type: {
      type: String,
      enum: ['STOCK', 'CRYPTO', 'BITCOIN', 'INTRADAY'],
      required: true,
    },
    quantity: { type: Number, required: true },
    avgPrice: { type: Number, required: true },
    currentPrice: { type: Number, default: 0 },
    totalValue: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
)

const Asset = mongoose.model('Asset', AssetSchema)
export default Asset
