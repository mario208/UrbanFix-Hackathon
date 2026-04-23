import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
      address: { type: String }
    },
    category: { type: String, enum: ['Roads', 'Electricity', 'Sewage', 'Trash', 'Pending'] },
    priority: { type: String, enum: ['High', 'Medium', 'Low', 'Pending'] },
    status: { type: String, enum: ['Pending', 'In Progress', 'Resolved'], default: 'Pending' }
  },
  { timestamps: true }
);

export default mongoose.model('Report', reportSchema);